import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item } from 'src/app/models/item.models';
import { List } from 'src/app/models/list.models';
import { User } from 'src/app/models/user.models';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ListService } from 'src/app/services/list-service/list.service';
import { closeModal, openModal } from 'src/app/utils/animations.utils';
import { pascalCase } from 'src/app/utils/casing.utils';
import * as Tesseract from 'tesseract.js';
// import { Tesseract } from "tesseract.ts";

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {
  // Inputs and outputs

  // Local variables
  list: string[] = [
    'Apples',
    'chicken',
    'mushrooms',
    'rice',
    'Coconut',
    'bananas'
  ]

  img = '';
  lists: BehaviorSubject<List[]> = new BehaviorSubject<List[]>([]);
  selectedList: BehaviorSubject<List | null> = new BehaviorSubject<List | null>(null);
  initialItems: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);

  // Constructor for service injection
  constructor(private authService: AuthService, private listService: ListService) { }

  // Initialization function to run once (on component instantiation)
  ngOnInit(): void {
    this.authService.getUser().subscribe((user: User | null) => {
      if (user) {
        this.listService.getUserLists(user.id);
      }
    });

    this.listService.userLists.subscribe(lists => {

      let active: List[] = [];
      let complete: List[] = [];

      lists.forEach(l => {
        let isComplete = true;
        l.items.forEach(i => {
          if (i.needed > i.quantity) {
            isComplete = false;
          }
        });

        if (isComplete) {
          complete = [...complete, l];
        } else {
          active = [...active, l];
        }
      })
      this.lists.next([...active, ...complete])
    })
  }

  // Precondition: File change event
  // Postcondition: Processes images
  onFileChanged(event: any): void {
    const image = event.target.files[0];

    // encode the file using the FileReader API
    const reader = new FileReader();
    reader.onloadend = () => {

      // use a regex to remove data url part
      this.img = reader.result as string;
      // const base64String = reader.result?.replace('data:', '').replace(/^.+,/, '');

      // log to console
      // logs wL2dvYWwgbW9yZ...
    };
    reader.readAsDataURL(image);

    Tesseract.recognize(image)
      .then((res: any) => {
        // Pic has been processed
        const wordsInPic: string[] = res.data.words.map((word: any) => word.text.toLowerCase());
        const wordsInList = this.list.map(item => item.toLowerCase());
        console.log(this.getOverlappingWords(wordsInList, wordsInPic));
        console.log(res.data.words);
      })
      .catch(console.error);

  }


  // Precondition: List words as array of inidivudal words, word list from picture
  // Postcondition: Returns overlapping words
  private getOverlappingWords(listWords: string[], wordsFromPic: string[]): string[] {
    let matchingWords: string[] = [];

    // Compares lists, appends valid words
    listWords.forEach(item => {
      wordsFromPic.forEach(list => {
        if (list.length > 3 && (list.includes(item) || item.includes(list))) {
          if (!matchingWords.includes(item)) {
            matchingWords = [...matchingWords, item];
          }
        }
      });
    });

    return matchingWords;
  }

  getPascal(str: string): string {
    return pascalCase(str);
  }

  isOverdue(dateString: string): boolean {
    const d = new Date(dateString);
    return d <= new Date();
  }

  getDate(dateString: string): string {
    const d = new Date(dateString);
    return d.toLocaleDateString();
  }

  isComplete(list: List): string {
    let isActive = false;

    list.items.forEach(i => {
      if (i.needed > i.quantity)
        isActive = true;
    })

    return isActive ? 'Active' : 'Complete';
  }

  openList(list: List): void {
    this.selectedList.next(Object.assign({}, list));
    let next = Object.assign([], list.items.map(i => Object.assign({}, i)));
    next = [...next.filter((i: Item) => i.quantity < i.needed), ...next.filter((i: Item) => i.quantity >= i.needed)]
    this.initialItems.next(next);
    this.openModal();
  }

  openModal(): void {
    const modal = document.getElementById('list-modal') as HTMLDivElement;
    openModal(modal);
  }

  cancelModal(): void {
    this.lists.value.forEach(l => {
      if (l.id === this.selectedList.value?.id) {
        l.items = this.initialItems.value;
      }
    })
    this.closeModal();
  }

  closeModal(): void {
    const modal = document.getElementById('list-modal') as HTMLDivElement;
    closeModal(modal);
  }

  saveList(): void {
    console.log(this.selectedList.value?.items);
    if (this.selectedList.value) {
      this.listService.saveListEdit(this.selectedList.value);
    }
    this.closeModal();
  }

  alterItem(event: any): void {

    const listID = event.listID;
    const item = event.item;
    const newValue = event.num ? parseInt(event.num) : 0;




    const old = this.lists.value;
    old.forEach(l => {
      if (l.id === listID) {
        l.items.forEach(i => {
          if (i.id === item.id) {
            const initialItem = this.initialItems.value.find(it => it.id === i.id);
            if (initialItem) {
              i.quantity = initialItem.quantity + newValue;
            }
          }
        })
      }
    })

    console.log(listID, item, newValue);

    this.lists.next(old)

  }
}
