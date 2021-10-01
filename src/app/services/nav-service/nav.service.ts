import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  constructor() { }
  showSearch: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  toggleSearch() {
    const current = this.showSearch.value;
    this.showSearch.next(!current);
  }
}
