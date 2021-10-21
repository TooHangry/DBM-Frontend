import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HomeInfo } from 'src/app/models/home.models';
import { Item } from 'src/app/models/item.models';
import { NavService } from 'src/app/services/nav-service/nav.service';
import { pascalCase } from 'src/app/utils/casing.utils';

@Component({
  selector: 'app-home-items',
  templateUrl: './home-items.component.html',
  styleUrls: ['./home-items.component.scss']
})
export class HomeItemsComponent implements OnInit {
  // Inputs and outputs
  @Input() home: HomeInfo | null = null;
  @Output() addItem: EventEmitter<null> = new EventEmitter();
  @Output() deleteItem: EventEmitter<Item> = new EventEmitter();

  // Local variables
  items: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  category = '';
  isFiltering = false;

  // Constructor for service injection
  constructor(private navService: NavService) { }

  // Initialization function (to run once)
  ngOnInit(): void {
    this.navService.emptySearch.subscribe(() => this.isFiltering = false);

    // Subscribes to navbar keyword search
    this.navService.activeSearch.subscribe(keyword => {
      keyword.length > 0 ? this.keywordFilterResults(keyword) : this.clearKeywordResults();
    });

    // Subscribes to active home
    this.navService.activeHome.subscribe(home => {
      this.home = home;
      if (this.home){
        this.items.next(this.home.items);
      }
    });

    // Subscribes to active category
    this.navService.selectedCategory.subscribe(category => {
      if (this.home && !this.isFiltering) {
        this.category = category;
        category.length > 0 ? this.categoryFilterResults(category) : this.clearCategoryResults();
      }
    });
  }

  // Precondition: The name of the item to transform
  // Postcondition: Converts the item name to have capital letters at the start of each word
  getPascalCase(itemName: string): string {
    return pascalCase(itemName);
  }

  // Precondition: The category to filter on
  // Postcondition: Filters home items if they are in the category
  private categoryFilterResults(category: string): void {
    if (this.home) {
      this.items.next(this.home.items.filter(item => item.category === category));
    }
  }

  // Precondition: Nothing
  // Postcondition: Resets item results from category filter
  private clearCategoryResults(): void {
    if (this.home) {
      this.items.next(this.home.items);
    }
  }

  // Precondition: The keyword to filter on
  // Postcondition: Filters home items if they contain the keyword
  private keywordFilterResults(keyword: string): void {
    if (this.home) {
      this.items.next(this.home.items.filter(item => item.item.toLowerCase().includes(keyword)));
      this.isFiltering = true;
      this.navService.selectedCategory.next('');
    }
  }

  // Precondition: Nothing
  // Postcondition: Resets item results from filter
  private clearKeywordResults(): void {
    if (this.home) {
      this.items.next(this.home.items);
      this.isFiltering = false;
      this.navService.emptySearch.next(null);
    }
  }
}
