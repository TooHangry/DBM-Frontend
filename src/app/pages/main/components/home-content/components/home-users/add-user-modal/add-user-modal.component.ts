import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.scss']
})
export class AddUserModalComponent implements OnInit {
  // Inputs/Outputs 
  @Output() closeAddUserModal: EventEmitter<null> = new EventEmitter();
  @Output() newUser: EventEmitter<string> = new EventEmitter();

  // Local component variables
  emailRegx = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  emails: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  canSave: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userEmail = '';

  // Constructor for injections
  constructor(private authService: AuthService) { }

  // Initialization function to run once (at moment of component instantiation)
  ngOnInit(): void {
    // Gets the current user email (if logged in)
    this.authService.user.subscribe(user => {
      if (this.userEmail.length < 1 && user) {
        this.userEmail = user.email;
      }
    });
  }

  // Precondition: Nothing. Activated on 'save' button click
  // Postcondition: Creates a new home by emitting the 'addHome' event with a new home instance
  save(): void {
    const email = this.emails.value && this.emails.value.length > 0 ? this.emails.value[0] : '';
    if (email.length > 0) 
      this.newUser.emit(email);
  }

  // Precondition: Activated on 'cancel' button click
  // Postcondition: Emits the 'cancelModal' event to be captured by parent component
  cancel(): void {
    this.closeAddUserModal.emit();
    this.emails.next([]);
  }

  // Precondition: A 'keyup' event from add-home-modal HTML file
  // Postcondition: Checks if the email is valid via RegEx, appending the valid email
  checkEmail(event: any): void {
    const email = (document.getElementById('add-user-email') as HTMLInputElement).value;

    // If the enter button is clicked, submit the email if valid
    if (event.keyCode === 13 || event.key === 'Enter') {
      this.getEmail();
    }

    // Changes the email border to red if invalid
    this.emailRegx.test(email) ? this.acceptUserEmailInput() : this.flagUserEmailInput();
  }

  // Precondition: Called when 'Enter' is pressed or 'Add Email' button is clicked
  // Postcondition: Appends the email to the list if valid
  getEmail(): void {
    const email = (document.getElementById('add-user-email') as HTMLInputElement).value;

    if (this.emailRegx.test(email)) {
      if (!this.emails.value.includes(email)) {
        this.emails.next([email, ...this.emails.value]);
      }

      (document.getElementById('add-user-email') as HTMLInputElement).value = "";
      (document.getElementById('user-container') as HTMLInputElement).style.border = '0px';
      this.canSave.next(true);
      return;
    }

    // Alerts the user that the email is invalid
    this.flagUserEmailInput();
  }

  // Precondition: The email to remove
  // Postcondition: Removes 'deleted' email from list
  removeEmail(email: string): void {
    this.emails.next(this.emails.value.filter(e => e !== email));
    this.canSave.next(false);
  }

  // Precondition: The email to check
  // Postcondition: Returns true if the user is not adding their own email
  notUserEmail(email: string): boolean {
    return this.userEmail.length > 0 && this.userEmail !== email;
  }

  // Precondition: Nothing
  // Postcondition: Creates a red border around email input
  private flagUserEmailInput(): void {
    (document.getElementById('user-container') as HTMLInputElement).style.border = '2px solid red';
    // this.canSave.next(false);
  }

  // Precondition: Nothing
  // Postcondition: Removes border around email input
  private acceptUserEmailInput(): void {
    (document.getElementById('user-container') as HTMLInputElement).style.border = '0';
    // this.canSave.next(true);
  }
}
