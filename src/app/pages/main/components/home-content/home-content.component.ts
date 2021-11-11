import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HomeInfo, Invite, Member } from 'src/app/models/home.models';
import { Item } from 'src/app/models/item.models';
import { HomeService } from 'src/app/services/home-service/home.service';
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
  
  // Constructor for service injections
  constructor(private navService: NavService) { }

  ngOnInit(): void {
    this.navService.selectedCategory.subscribe(category => {
      if (category.length > 0) {
        this.currentState.next('items')
      }
    });
  }

  // Precondition: The state to switch to
  // Postcondition: Sets the state of this component
  setState(state: string): void {
    this.currentState.next(state);
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
}
