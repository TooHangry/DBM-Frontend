import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HomeInfo } from 'src/app/models/home.models';
import { List } from 'src/app/models/list.models';
import { User } from 'src/app/models/user.models';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ListService } from 'src/app/services/list-service/list.service';
import { NavService } from 'src/app/services/nav-service/nav.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  // Local Variables
  user: User | null = null;
  categories: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  home: BehaviorSubject<HomeInfo | null> = new BehaviorSubject<HomeInfo | null>(null);
  shouldShowSearch: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  state: BehaviorSubject<string> = new BehaviorSubject<string>('item');
  lists: BehaviorSubject<List[]> = new BehaviorSubject<List[]>([]);
  isEditingList: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Constructor for service injection
  constructor(private router: Router, private navService: NavService, private authService: AuthService, private listService: ListService) { }

  // Initialization function to run once
  ngOnInit(): void {
    // Gets the current user if logged in
    this.authService.user.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });

    this.navService.lists.subscribe(lists => {
      if (lists) {
        this.lists.next(lists);
      }
    });

    this.navService.state.subscribe(state => {
      this.state.next(state);
    })

    // Determines if search should be shown
    this.navService.showSearch.subscribe(shouldShowSearch => {
      this.shouldShowSearch.next(shouldShowSearch);
    });

    // Clears the search bar if triggered
    this.navService.emptySearch.subscribe(() => {
      const searchBar = document.getElementById('navbar-search') as HTMLInputElement;
      if (searchBar) {
        searchBar.value = '';
      }
    })

    // Subscribes to the active home to reflect categories
    this.navService.activeHome.subscribe(home => {
      this.home.next(home);
      this.navService.activeCategories.subscribe((categories: string[]) => {
        this.categories.next(categories);
      });
    });

    this.navService.isEditingList.subscribe(isEditing => {
      this.isEditingList.next(isEditing);
    })
  }

  // Precondition: A keyup event (From HTML)
  // Postcondition: Emits a filter event on the serach property
  keyUp(event: any) {
    const searchBar = document.getElementById('navbar-search') as HTMLInputElement;
    if (searchBar) {
      const navbarText = searchBar.value;
      this.navService.activeSearch.next(navbarText.toLowerCase());
    }
  }

  // Precondition: Nothing
  // Postcondition: Routes to the home selection page
  chooseNewHome(): void {
    this.navService.activeHome.next(null);
    this.navService.emptySearch.next(null);
    this.router.navigate(['/homes']);
  }

  // Precondition: Nothing
  // Postcondition: Returns home nickname
  getNickname(): string {
    return this.home.value ? this.home.value.nickname : '';
  }

  // Precondition: The category to select
  // Postcondition: Sets the active category
  select(category: string): void {
    this.navService.emptySearch.next(null);
    this.navService.selectedCategory.next(category);
    this.navService.activeSearch.next('');
  }


  // Precondition: The category to check
  // Postcondition: Returns true if the current category matches the param category
  isSelected(category: string): boolean {
    return category == this.navService.selectedCategory.value;
  }

  // Preconditon: Nothing
  // Postcondition: Returns the user's name if logged in
  getName(): string {
    return this.user ? this.user.fname : '';
  }

  // Precondition: The category to check
  // Postcondition: Returns true if the current category matches the param category
  isSelectedList(list: List): boolean {
    return (this.navService.selectedList.value !== null && list.id === this.navService.selectedList.value.id);
  }

  // Precondition: The category to select
  // Postcondition: Sets the active category
  selectList(list: List): void {
    if (!this.isEditingList.value) {
      this.navService.selectedList.next(list);
    }
  }

  showListSelect(): void {
    if (!this.isEditingList.value) {
      this.navService.selectedList.next(null);
      this.listService.cancelEdits();
    }
  }

  showBackButton(): boolean {
    return this.navService.selectedList.value !== null;
  }
}
