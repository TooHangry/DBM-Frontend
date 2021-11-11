import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Member } from 'src/app/models/home.models';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { NavService } from 'src/app/services/nav-service/nav.service';

@Component({
  selector: 'app-add-list-modal',
  templateUrl: './add-list-modal.component.html',
  styleUrls: ['./add-list-modal.component.scss']
})
export class AddListModalComponent implements OnInit {
  // Inputs/Outputs 
  @Output() closeAddUserModal: EventEmitter<null> = new EventEmitter();
  @Output() newUser: EventEmitter<string> = new EventEmitter();

  // Local component variables
  emailRegx = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  emails: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  users: BehaviorSubject<Member[]> = new BehaviorSubject<Member[]>([]);
  canSave: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
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
        this.users.next(home.users);
      }
    })
  }

  // Precondition: Nothing. Activated on 'save' button click
  // Postcondition: Creates a new home by emitting the 'addHome' event with a new home instance
  save(): void {
    const email = this.emails.value && this.emails.value.length > 0 ? this.emails.value[0] : '';
    if (email.length > 0) {
      this.newUser.emit(email);
      this.emails.next([]);
    }
  }

  // Precondition: Activated on 'cancel' button click
  // Postcondition: Emits the 'cancelModal' event to be captured by parent component
  cancel(): void {
    this.closeAddUserModal.emit();
    this.emails.next([]);
  }

  getDate(): string {
    const today = new Date()
    return today.toLocaleDateString();
  }

  // changedStart(): void {
  //   const start = document.getElementById('list-start-date') as HTMLInputElement;
  //   // const date = new Date(start.value).getUTCDate();
  //   if (start.value.length > 0) {
  //     this.checkSave();
  //   }
  // }

  // changedEnd(): void {
  //   const end = document.getElementById('list-start-date') as HTMLInputElement;
  //   // const date = new Date(start.value).getUTCDate();
  //   if (end.value.length > 0) {
  //     this.checkSave();
  //   }
  // }

  shouldDisableEnd(): boolean {
    const start = document.getElementById('list-start-date') as HTMLInputElement;
    return !(start && start.value.length > 0);
  }

  getMin(): string {
    const start = document.getElementById('list-start-date') as HTMLInputElement;
    return start ? start.value : '';
  }


  checkSave(): void {
    const start = document.getElementById('list-start-date') as HTMLInputElement;
    const end = document.getElementById('list-end-date') as HTMLInputElement;
    const title = document.getElementById('list-title') as HTMLInputElement;

    if (start.value.length > 0 && end.value.length > 0 && title.value.length > 0) { 
      this.canSave.next(true);
    }
    else {
      this.canSave.next(false);
    }
  }
}
