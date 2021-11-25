import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from 'src/app/models/item.models';
import { List } from 'src/app/models/list.models';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { pascalCase } from 'src/app/utils/casing.utils';
import * as Tesseract from 'tesseract.js';

@Component({
  selector: 'app-list-modal',
  templateUrl: './list-modal.component.html',
  styleUrls: ['./list-modal.component.scss']
})
export class ListModalComponent implements OnInit {
  // Inputs and outputs
  @Output() cancelModal: EventEmitter<null> = new EventEmitter();
  @Output() saveList: EventEmitter<null> = new EventEmitter();
  @Output() changeItem: EventEmitter<any> = new EventEmitter();
  @Input() list: List | null = null;
  @Input() initial: Item[] | null = [];

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
  }

  // Precondition: Nothing
  // Postcondition: Emits 'save' event
  save() {
    this.saveList.emit();
  }

  // Precondition: Nothing
  // Postcondition: Emits 'cancel' event
  cancel() {
    this.cancelModal.emit();
  }

  alterItem(item: Item, val: string): void {
    this.changeItem.emit({ listID: this.list?.id, item: item, num: val });
  }

  isComplete(item: Item): boolean {
    const current = this.initial?.find(i => i.id === item.id);
    if (current)
      return (current.needed <= current.quantity)
    return false;
  }

  getPascal(str: string): string {
    return pascalCase(str);
  }

  // Precondition: File change event
  // Postcondition: Processes images
  onFileChanged(event: any): void {
    const image = event.target.files[0];

    // encode the file using the FileReader API
    const reader = new FileReader();
    reader.onloadend = () => {

      // use a regex to remove data url part
      // this.img = reader.result as string;
      // const base64String = reader.result?.replace('data:', '').replace(/^.+,/, '');

      // log to console
      // logs wL2dvYWwgbW9yZ...
    };
    reader.readAsDataURL(image);

    this.loadingService.isLoading.next(true);
    Tesseract.recognize(image)
      .then((res: any) => {
        // Pic has been processed
        const wordsInPic: string[] = res.data.words.map((word: any) => word.text.toLowerCase());
        const wordsInList = this.list?.items.map(item => item.item.toLowerCase());

        const allWords = res.data.words;
        const overlappingWords = this.getOverlappingWords(wordsInList ?? [], wordsInPic);

        overlappingWords.forEach(word => {
          this.list?.items.forEach(i => {
            if (i.item.toLowerCase().includes(word.toLowerCase()) || word.toLowerCase().includes(i.item.toLowerCase())) {
              this.changeItem.emit({ listID: this.list?.id, item: i, num: i.needed - i.quantity });

              this.initial?.forEach(it => {
                if(it.id === i.id) {
                  it.needed = 0;
                }
              })
            }
          })
        });
        this.loadingService.isLoading.next(false);
      }).catch(console.error);
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
}
