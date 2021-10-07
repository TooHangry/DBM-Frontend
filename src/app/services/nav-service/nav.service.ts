import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HomeInfo } from 'src/app/models/home.models';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  constructor() { }
  showSearch: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  activeCategories: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  selectedCategory: BehaviorSubject<string> = new BehaviorSubject<string>('');
  activeHome: BehaviorSubject<HomeInfo | null> = new BehaviorSubject<HomeInfo | null>(null);

  toggleSearch() {
    const current = this.showSearch.value;
    this.showSearch.next(!current);
  }
}
