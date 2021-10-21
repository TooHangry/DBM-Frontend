import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // Local variables
  errorMessage: BehaviorSubject<string> = new BehaviorSubject<string>('');
  isLogin = true;

  // Constructor
  constructor(private authService: AuthService) { }

  // Initialization function
  ngOnInit(): void {
  }

  // Precondition: The user presses enter
  // Postcondition: Logs in or signs up the user accordingly
  keyUpEvent(event: any) {
    if (event.keyCode === 13 || event.key === 'Enter') {
      this.isLogin ? this.login() : this.signup();
    }
  }

  // Preconditon: Activated when the user clicks 'login' or presses Enter
  // Postcondition: Logs the user in on valid credentials
  login(): void {
    const email = (document.getElementById('login-email') as HTMLInputElement).value;
    const password = (document.getElementById('login-password') as HTMLInputElement).value;

    if (email.length > 0 && password.length > 0) {
      this.authService.login(email, password);
      // TODO: Check error on login, notify user of bad request
    }
  }

  // Preconditon: Activated when the user clicks 'sign up' or presses Enter
  // Postcondition: Creates a new user if the credentials are valid
  signup(): void {
    const fname = (document.getElementById('signup-fname') as HTMLInputElement).value;
    const lname = (document.getElementById('signup-lname') as HTMLInputElement).value;
    const email = (document.getElementById('signup-email') as HTMLInputElement).value;
    const password1 = (document.getElementById('signup-password1') as HTMLInputElement).value;
    const password2 = (document.getElementById('signup-password2') as HTMLInputElement).value;

    // TODO: Check password, valid email, verify email does not exist, etc. 

    if (password1 == password2) {
      this.authService.signup(email, password1, fname, lname);
      // TODO: Check error on signup, notify user of bad request
    }
  }

  // Precondition: Nothing
  // Postcondition: Switches login state
  toggleLogin(): void {
    this.isLogin = !this.isLogin;
  }
}
