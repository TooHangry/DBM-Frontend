import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HomeInfo, Invite, Member } from 'src/app/models/home.models';
import { closeModal, openModal } from 'src/app/utils/animations.utils';

@Component({
  selector: 'app-home-users',
  templateUrl: './home-users.component.html',
  styleUrls: ['./home-users.component.scss']
})
export class HomeUsersComponent implements OnInit {
  // Inputs and outputs
  @Input() home: HomeInfo | null = null;
  @Output() deleteMember: EventEmitter<Member> = new EventEmitter();

  // Local variables
  userToDelete: Member | null = null;
  inviteToDelete: Invite | null = null;

  // Constructor for service injections
  constructor() { }

  // Initialization function (to run once)
  ngOnInit(): void {
  }

  // Precondition: The user to remove
  // Postcondition: Opens modal
  selectUserToRemove(user: Member): void {
    this.userToDelete = user;
    this.inviteToDelete = null;

    const modal = (document.getElementById('remove-user-modal') as HTMLDivElement);
    openModal(modal);
  }

  // Precondition: The invite to remove
  // Postcondition: Opens modal
  selectInviteToRemove(invite: Invite): void {
    this.inviteToDelete = invite;
    this.userToDelete = null;
    const modal = (document.getElementById('remove-user-modal') as HTMLDivElement);
    openModal(modal);
  }

  // Precondition: Nothing, called by the modal
  // Postcondition: Emits the Member to remove, closes modal
  removeItem(): void {
    const isUser = this.userToDelete !== null;

    if (isUser) {
      console.log("Removing ", this.userToDelete);
    }
    else {
      console.log("Removing, ", this.inviteToDelete);
    }

    this.closeDeleteModal();
  }

  // Precondition: Nothing,
  // Postcondition: Closes modal
  closeDeleteModal(): void {
    const modal = (document.getElementById('remove-user-modal') as HTMLDivElement);
    closeModal(modal);
  }
}
