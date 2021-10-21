import { Component, OnInit } from '@angular/core';
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


  // Constructor for service injection
  constructor() { }

  // Initialization function to run once (on component instantiation)
  ngOnInit(): void {
  }


  onFileChanged(event: any): void {
    const image = event.target.files[0];
    console.log(image);

    Tesseract.recognize(image)
    .then((res: any) => {
      // Pic has been processed
      const wordsInPic: string[] = res.data.words.map((word: any) => word.text.toLowerCase());
      const wordsInList = this.list.map(item => item.toLowerCase());

      console.log(this.getOverlappingWords(wordsInList, wordsInPic));
    })
    .catch(console.error);

  }


  // Precondition: List words as array of inidivudal words, word list from picture
  // Postcondition: Returns overlapping words
  private getOverlappingWords(listWords: string[], wordsFromPic: string[]): string[] {

    let matchingWords: string[] = [];

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
