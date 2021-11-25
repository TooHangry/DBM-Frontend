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
