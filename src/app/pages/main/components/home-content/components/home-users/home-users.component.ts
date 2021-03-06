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
  @Output() removeInvite: EventEmitter<Invite> = new EventEmitter();
  @Output() removeMember: EventEmitter<Member> = new EventEmitter();
  @Output() closeAddUserModal: EventEmitter<null> = new EventEmitter();
  @Output() newUser: EventEmitter<string> = new EventEmitter();

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

    if (isUser && this.userToDelete) {
      this.removeMember.emit(this.userToDelete);
    }
    else if (this.inviteToDelete) {
      this.removeInvite.emit(this.inviteToDelete);
    }
    this.closeDeleteModal();
  }

  // Precondition: Nothing,
  // Postcondition: Closes modal
  closeDeleteModal(): void {
    const modal = (document.getElementById('remove-user-modal') as HTMLDivElement);
    closeModal(modal);
  }

  // Precondition: The member to check
  // Postcondition: Returns a boolean
  isNotAdmin(member: Member): boolean {
   return member.email !== this.home?.admin;
  }
}
