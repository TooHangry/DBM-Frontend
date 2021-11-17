import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HomeInfo, Invite, Member } from 'src/app/models/home.models';
import { Item } from 'src/app/models/item.models';
import { HomeService } from 'src/app/services/home-service/home.service';
import { ListService } from 'src/app/services/list-service/list.service';
import { NavService } from 'src/app/services/nav-service/nav.service';
import { closeModal, openModal } from 'src/app/utils/animations.utils';

@Component({
  selector: 'app-home-content',
  templateUrl: './home-content.component.html',
  styleUrls: ['./home-content.component.scss']
})
export class HomeContentComponent implements OnInit {
  // Inputs and outputs
  @Input() home: HomeInfo | null = null;
  @Output() addItem: EventEmitter<null> = new EventEmitter();
  @Output() deleteItem: EventEmitter<Item> = new EventEmitter();
  @Output() removeInvite: EventEmitter<Invite> = new EventEmitter();
  @Output() removeMember: EventEmitter<Member> = new EventEmitter();
  @Output() increaseItem: EventEmitter<Item> = new EventEmitter();
  @Output() decreaseItem: EventEmitter<Item> = new EventEmitter();
  @Output() saveItem: EventEmitter<Item> = new EventEmitter();
  @Output() increaseThreshold: EventEmitter<Item> = new EventEmitter();
  @Output() decreaseThreshold: EventEmitter<Item> = new EventEmitter();
  @Output() itemSelected: EventEmitter<Item> = new EventEmitter();
  @Output() newUser: EventEmitter<string> = new EventEmitter();

  // Local Variables
  currentState: BehaviorSubject<string> = new BehaviorSubject<string>('items');
  showListSave: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  // Constructor for service injections
  constructor(private navService: NavService, private listService: ListService) { }

  ngOnInit(): void {
    this.navService.selectedCategory.subscribe(category => {
      if (category.length > 0) {
        this.currentState.next('items')
      }
    });

    this.navService.isEditingList.subscribe(isEditing => this.showListSave.next(isEditing));
  }

  // Precondition: The state to switch to
  // Postcondition: Sets the state of this component
  setState(state: string): void {
    if (!this.showListSave.value) {
      this.currentState.next(state);
      this.navService.state.next(state);
      this.cancelEdits();
      this.navService.selectedList.next(null);

      if (state == 'lists') {
        this.listService.getListsForHome(this.home?.id ?? 1).subscribe(homeLists => {
        });
      }
    }
  }

  // Precondition: Nothing
  // Postcondition: Opens the add user modal
  openAddUserModal(): void {
    const userModal = document.getElementById('add-user-modal') as HTMLDivElement;
    openModal(userModal);
  }

  // Precondition: Nothing
  // Postcondition: Closes the add user modal
  closeAddUserModal(): void {
    const userModal = document.getElementById('add-user-modal') as HTMLDivElement;
    closeModal(userModal);
  }

  createNewUser(event: string): void {
    this.newUser.emit(event);
    this.closeAddUserModal();
  }

  openAddListModal(): void {
    if (!this.showListSave.value) {
      const modal = document.getElementById('add-list-modal') as HTMLDivElement;
      openModal(modal);
    }
  }

  closeAddListModal(): void {
    const modal = document.getElementById('add-list-modal') as HTMLDivElement;
    closeModal(modal);
  }

  saveEdits(): void {
    this.showListSave.next(false);
    this.navService.isEditingList.next(false);
    this.listService.saveChanges();
  }

  cancelEdits(): void {
    this.showListSave.next(false);
    this.navService.isEditingList.next(false);
    this.listService.cancelEdits();
  }

  getItemsInLists(): number {
    return this.navService.activeHome.value?.items.filter(i => i.isInAList).length ?? 0;
  }

  getListCount(): number {
    return this.listService.lists?.value.length;
  }
}
