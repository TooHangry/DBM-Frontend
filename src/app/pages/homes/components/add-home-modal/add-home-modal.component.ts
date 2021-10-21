import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HomeToAdd } from 'src/app/models/home.models';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { NavService } from 'src/app/services/nav-service/nav.service';

@Component({
  selector: 'app-add-home-modal',
  templateUrl: './add-home-modal.component.html',
  styleUrls: ['./add-home-modal.component.scss']
})
export class AddHomeModalComponent implements OnInit {
  // Inputs and Outputs
  @Output() addHome: EventEmitter<HomeToAdd> = new EventEmitter();
  @Output() cancelModal: EventEmitter<null> = new EventEmitter();

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
        this.emails.next([user.email, ... this.emails.value]);
      }
    });
  }

  // Precondition: Nothing. Activated on 'save' button click
  // Postcondition: Creates a new home by emitting the 'addHome' event with a new home instance
  save(): void {
    const name = (document.getElementById('home-name') as HTMLInputElement).value;
    const home: HomeToAdd = {
      nickname: name,
      invites: this.emails.value
    };
    this.addHome.emit(home);
  }

  // Precondition: Activated on 'cancel' button click
  // Postcondition: Emits the 'cancelModal' event to be captured by parent component
  cancel(): void {
    this.cancelModal.emit();
  }

  // Precondition: A 'keyup' event from add-home-modal HTML file
  // Postcondition: Checks if the email is valid via RegEx, appending the valid email
  checkEmail(event: any): void {
    const email = (document.getElementById('home-email') as HTMLInputElement).value;

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
    const email = (document.getElementById('home-email') as HTMLInputElement).value;

    if (this.emailRegx.test(email)) {
      if (!this.emails.value.includes(email)) {
        this.emails.next([email, ...this.emails.value]);
      }

      (document.getElementById('home-email') as HTMLInputElement).value = "";
      (document.getElementById('email-container') as HTMLInputElement).style.border = '0px';
      return;
    }

    // Alerts the user that the email is invalid
    this.flagUserEmailInput();
    this.checkSave();
  }

  // Precondition: The email to remove
  // Postcondition: Removes 'deleted' email from list
  removeEmail(email: string): void {
    this.emails.next(this.emails.value.filter(e => e !== email));
    this.checkSave();
  }

  // Precondition: Nothing
  // Postcondition: Activates save button if a name has been entered for the home
  checkSave(): void {
    const name = (document.getElementById('home-name') as HTMLInputElement).value;
    this.canSave.next(name.length > 0 && this.emails.value.length > 0);
  }

  // Precondition: The email to check
  // Postcondition: Returns true if the user is not adding their own email
  notUserEmail(email: string): boolean {
    return this.userEmail.length > 0 && this.userEmail !== email;
  }

  // Precondition: Nothing
  // Postcondition: Creates a red border around email input
  private flagUserEmailInput(): void {
    (document.getElementById('email-container') as HTMLInputElement).style.border = '2px solid red';
  }

  // Precondition: Nothing
  // Postcondition: Removes border around email input
  private acceptUserEmailInput(): void {
    (document.getElementById('email-container') as HTMLInputElement).style.border = '0';
  }
}
