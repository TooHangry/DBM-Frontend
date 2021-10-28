import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Home, HomeInfo, Invite, Member } from 'src/app/models/home.models';
import { Item } from 'src/app/models/item.models';
import { User } from 'src/app/models/user.models';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { HomeService } from 'src/app/services/home-service/home.service';
import { NavService } from 'src/app/services/nav-service/nav.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { closeModal, openModal } from 'src/app/utils/animations.utils';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  // Local Variables
  flag = false;
  homes: BehaviorSubject<Home[]> = new BehaviorSubject<Home[]>([]);
  user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  selectedHome: BehaviorSubject<HomeInfo | null> = new BehaviorSubject<HomeInfo | null>(null);
  selectedItem: Item | null = null;

  // Constructor for service injections
  constructor(private navService: NavService, private homeService: HomeService,
    private authService: AuthService, private snackbarService: SnackbarService) { }

  // Initialization function to run once
  ngOnInit(): void {
    // Subscribes to the current user and sets home accordingly
    this.authService.getUser().subscribe((user: User | null) => {
      if (user) {
        this.user.next(user);
        if (user.homes) {
          this.homes.next(user.homes);
        }
      }
    });
    this.navService.activeHome.subscribe(home => {
        this.selectedHome.next(home);
    });
  }

  // Precondition: The homeItem creation event emitted from child component
  // Postcondition: Adds the item to the home
  addItem(homeItem: any): void {
    if (this.selectedHome.value) {
      // TODO: Add logic here to verify that the item does not exist within the home.
      //      Only close modal if it doesn't exist. Else, show an error
      this.homeService.addItem(this.selectedHome.value, homeItem);
      this.closeAddModal();
    }
  }

  // Precondition: Activated when user clicks 'Add Item' FAB
  // Postcondition: Opens the add item modal
  openAddModal(): void {
    const modal = (document.getElementById('add-modal') as HTMLDivElement);
    openModal(modal);
  }

  // Precondition: Activated when 'closeModal' event is received from the modal
  // Postcondition: Closes the modal
  closeAddModal(): void {
    const modal = (document.getElementById('add-modal') as HTMLDivElement);
    closeModal(modal);
  }

  // Precondition: Activated when user clicks 'delete' on item. The item to delete
  // Postcondition: Opens the add item modal
  openDeleteModal(itemToDelete: Item): void {
    this.selectedItem = itemToDelete;
    const modal = (document.getElementById('delete-modal') as HTMLDivElement);
    openModal(modal);
  }

  // Precondition: Activated when 'closeModal' event is received from the modal
  // Postcondition: Closes the modal
  closeDeleteModal(): void {
    const modal = (document.getElementById('delete-modal') as HTMLDivElement);
    closeModal(modal);
  }

  // Precondition: Nothing
  // Postcondition: Removes the item from the home
  removeItem(): void {
    if (this.selectedItem && this.selectedHome.value) {
      this.homeService.removeItem(this.selectedHome.value, this.selectedItem).subscribe(
        (item) => {
        if (item && this.selectedHome.value)
        this.selectedHome.next({
          ...this.selectedHome.value,
          items: this.selectedHome.value?.items.filter(i => i.id !== item.id)
        });

        this.navService.activeHome.next(this.selectedHome.value);
        this.navService.selectedCategory.next(this.selectedItem ? this.selectedItem.category : '');
        this.snackbarService.setState(true, `${this.selectedItem?.item} Deleted From ${this.selectedHome.value?.nickname}`, 2500);
      },
      (error) => {
        this.snackbarService.setState(false, 'Could Not Delete Item', 2500);
      });
    }
    this.closeDeleteModal();
  }

  removeInvite(event: Invite): void {
    console.log("Removing invite ", event);
    this.authService.removeInvite(event.id);
  }

  removeMember(event: Member): void {
    const home = this.selectedHome.value;
    if (home) {
      console.log("Removing member ", event);
      this.authService.removeUser(home.id, event.id);
    }
  }

  // Precondition: Nothing
  // Postcondition: Gets the current home categories (if exists, else empty list)
  getCategories(): string[] {
    return this.user.value ? this.user.value.categories.sort((a, b) => a.localeCompare(b)) : [];
  }
}
