import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HomeInfo } from 'src/app/models/home.models';
import { List } from 'src/app/models/list.models';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  // Local variables
  showSearch: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  activeCategories: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  selectedCategory: BehaviorSubject<string> = new BehaviorSubject<string>('');
  activeHome: BehaviorSubject<HomeInfo | null> = new BehaviorSubject<HomeInfo | null>(null);
  activeSearch: BehaviorSubject<string> = new BehaviorSubject<string>('');
  emptySearch: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  state: BehaviorSubject<string> = new BehaviorSubject<string>('items');
  selectedList: BehaviorSubject<List | null> = new BehaviorSubject<List | null>(null);
  lists: BehaviorSubject<List[]> = new BehaviorSubject<List[]>([]);
  isEditingList: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Constructor
  constructor() { }

  // Precondition: The boolean value regarding visibility
  // Postcondition: Toggles the search bar up top
  toggleSearch(shouldShow: boolean) {
    this.showSearch.next(shouldShow);
  }
}
