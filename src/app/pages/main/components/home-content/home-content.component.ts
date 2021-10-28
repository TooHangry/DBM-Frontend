import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HomeInfo, Invite, Member } from 'src/app/models/home.models';
import { Item } from 'src/app/models/item.models';

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

  // Local Variables
  currentState: BehaviorSubject<string> = new BehaviorSubject<string>('items');
  
  // Constructor for service injections
  constructor() { }


  ngOnInit(): void {
  }

  // Precondition: The state to switch to
  // Postcondition: Sets the state of this component
  setState(state: string): void {
    this.currentState.next(state);
  }
}
