import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Member } from 'src/app/models/home.models';
import { NewList } from 'src/app/models/list.models';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { NavService } from 'src/app/services/nav-service/nav.service';

@Component({
  selector: 'app-add-list-modal',
  templateUrl: './add-list-modal.component.html',
  styleUrls: ['./add-list-modal.component.scss']
})
export class AddListModalComponent implements OnInit {
  // Inputs/Outputs 
  @Output() closeAddListModal: EventEmitter<null> = new EventEmitter();
  @Output() newList: EventEmitter<NewList> = new EventEmitter();

  // Local component variables
  emailRegx = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  emails: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  users: BehaviorSubject<Member[]> = new BehaviorSubject<Member[]>([]);
  canSave: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  selectedEmail = '';
  userEmail = '';

  // Constructor for injections
  constructor(private authService: AuthService, private navService: NavService) { }

  // Initialization function to run once (at moment of component instantiation)
  ngOnInit(): void {
    // Gets the current user email (if logged in)
    this.authService.user.subscribe(user => {
      if (this.userEmail.length < 1 && user) {
        this.userEmail = user.email;
      }
    });

    this.navService.activeHome.subscribe(home => {
      if (home && home.users) {
        this.emails.next(home.users.map(u => u.email));
        if (home && home.invites) {
          this.emails.next([...this.emails.value, ...home.invites.map(u => u.email)])
        }
      }
    })
  }

  // Precondition: Nothing. Activated on 'save' button click
  // Postcondition: Creates a new home by emitting the 'addHome' event with a new home instance
  save(): void {
    if (this.canSave.value) {
      const newList: NewList = {
        endDate: new Date((document.getElementById('list-end-date') as HTMLInputElement).value).toUTCString(),
        title: (document.getElementById('list-title') as HTMLInputElement).value,
        email: this.selectedEmail
      }
      this.newList.emit(newList);
      this.clear();
    }
  }

  // Precondition: Activated on 'cancel' button click
  // Postcondition: Emits the 'cancelModal' event to be captured by parent component
  cancel(): void {
    this.closeAddListModal.emit();
    this.clear()
  }

  clear(): void {
    (document.getElementById('list-end-date') as HTMLInputElement).value = '';
    (document.getElementById('list-title') as HTMLInputElement).value = '';
    this.selectedEmail = '';
  }

  getDate(): string {
    const today = new Date()
    return today.toLocaleDateString();
  }

  isSelected(email: string): boolean {
    return this.selectedEmail === email
  }

  selectEmail(email: string): void {
    this.selectedEmail = email;
  }

  getMin(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate() + 1
    const dateString =  year + "-" + month + "-" + day;
    return dateString;
  }

  checkSave(): void {
    const end = document.getElementById('list-end-date') as HTMLInputElement;
    const title = document.getElementById('list-title') as HTMLInputElement;

    if (end.value.length > 0 && title.value.length > 0 && this.selectedEmail) {
      this.canSave.next(true);
    }
    else {
      this.canSave.next(false);
    }
  }
}
