import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Home, HomeInfo, Invite, Member } from 'src/app/models/home.models';
import { Item } from 'src/app/models/item.models';
import { User } from 'src/app/models/user.models';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { HomeService } from 'src/app/services/home-service/home.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
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
  currentItemToUpdate: Item | null = null;

  // Constructor for service injections
  constructor(private navService: NavService, private homeService: HomeService,
    private authService: AuthService, private snackbarService: SnackbarService,
    private loadingService: LoadingService) { }

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
      this.loadingService.isLoading.next(true);
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
          this.loadingService.isLoading.next(false);
        },
        (error) => {
          this.snackbarService.setState(false, 'Could Not Delete Item', 2500);
          this.loadingService.isLoading.next(false);
        });
    }
    this.closeDeleteModal();
  }

  // Precondition: The invite to remove
  // Postcondition: Removes the invite
  removeInvite(event: Invite): void {
    this.authService.removeInvite(event.home, event.email);
  }

  // Precondition: The member to remove
  // Postcondition: Removes the member
  removeMember(event: Member): void {
    const home = this.selectedHome.value;
    if (home) {
      this.authService.removeUser(home.id, event.id);
    }
  }

  // Precondition: The item to increase
  // Postcondition: Increases the item
  increaseItem(event: Item) {
    const currentHome = this.navService.activeHome.value;
    if (currentHome) {
      currentHome.items.map(item => {
        if (item && item.id && item.id == event.id) {
          ++item.quantity;
        }
      })
      this.navService.activeHome.next(currentHome);
      this.navService.selectedCategory.next(this.navService.selectedCategory.value);
      if (this.navService.activeSearch.value.length > 0) {
        this.navService.activeSearch.next(this.navService.activeSearch.value);
      }
    }
  }

  // Precondition: The item to decrease
  // Postcondition: Decreases the item
  decreaseItem(event: Item) {
    const currentHome = this.navService.activeHome.value;
    if (currentHome) {
      currentHome.items.map(item => {
        if (item && item.id && item.id == event.id && item.quantity > 0) {
          --item.quantity;
        }
      })
      this.navService.activeHome.next(currentHome);
      this.navService.selectedCategory.next(this.navService.selectedCategory.value);
      if (this.navService.activeSearch.value.length > 0) {
        this.navService.activeSearch.next(this.navService.activeSearch.value);
      }
    }
  }

  // Precondition: The item to increase
  // Postcondition: Increases the item
  increaseThreshold(event: Item) {
    const currentHome = this.navService.activeHome.value;
    if (currentHome) {
      currentHome.items.map(item => {
        if (item && item.id && item.id == event.id) {
          ++item.alertThreshold;
        }
      })
      this.navService.activeHome.next(currentHome);
      this.navService.selectedCategory.next(this.navService.selectedCategory.value);
      if (this.navService.activeSearch.value.length > 0) {
        this.navService.activeSearch.next(this.navService.activeSearch.value);
      }
    }
  }

  // Precondition: The item to decrease
  // Postcondition: Decreases the item
  decreaseThreshold(event: Item) {
    const currentHome = this.navService.activeHome.value;
    if (currentHome) {
      currentHome.items.map(item => {
        if (item && item.id && item.id == event.id && item.alertThreshold > 0) {
          --item.alertThreshold;
        }
      })
      this.navService.activeHome.next(currentHome);
      this.navService.selectedCategory.next(this.navService.selectedCategory.value);
      if (this.navService.activeSearch.value.length > 0) {
        this.navService.activeSearch.next(this.navService.activeSearch.value);
      }
    }
  }

  // Precondition: The item selected
  // Postcondition: Opens modal to edit the item
  itemSelected(item: Item): void {
    this.currentItemToUpdate = item;
    const modal = (document.getElementById('update-modal') as HTMLDivElement);
    openModal(modal);
  }

  // Precondition: The item to save
  // Postcondition: Saves the item
  saveUpdatedItem(item: Item): void {
    this.closeUpdateModal();
    if (this.selectedHome.value) {
      this.homeService.saveItem(item, this.selectedHome.value.id);
      this.navService.emptySearch.next(null);
      this.navService.selectedCategory.next(item.category);
      this.navService.activeSearch.next('');
    }
  }

  // Precondition: Nothing
  // Postcondition: Closes update modal
  closeUpdateModal(): void {
    const modal = (document.getElementById('update-modal') as HTMLDivElement);
    closeModal(modal);
  }

  // Precondition: The item to save
  // Postcondition: Saves the item
  saveItem(event: Item): void {
    if (this.selectedHome.value) {
      this.homeService.saveItem(event, this.selectedHome.value.id);
      if (this.navService.activeSearch.value.length > 0) {
        this.navService.activeSearch.next(this.navService.activeSearch.value);
      }
    }
  }

  // Precondition: Nothing
  // Postcondition: Gets the current home categories (if exists, else empty list)
  getCategories(): string[] {
    return this.user.value ? this.user.value.categories.sort((a, b) => a.localeCompare(b)) : [];
  }
  
  addUserToHome(userToAdd: string): void {
    if (this.navService.activeHome.value) {
      this.homeService.addUser(userToAdd, this.navService.activeHome.value.id);
    }
  }
}
