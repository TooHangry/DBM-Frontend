import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) { }
  errorMessage: BehaviorSubject<string> = new BehaviorSubject<string>('');
  isLogin = true;
  
  ngOnInit(): void {
  }

  login(): void {
    const email = (document.getElementById('login-email') as HTMLInputElement).value;
    const password = (document.getElementById('login-password') as HTMLInputElement).value;

    this.authService.login(email, password); //.subscribe((user: User));
  }

  signup(): void {
    const fname = (document.getElementById('signup-fname') as HTMLInputElement).value;
    const lname = (document.getElementById('signup-lname') as HTMLInputElement).value;
    const email = (document.getElementById('signup-email') as HTMLInputElement).value;
    const password1 = (document.getElementById('signup-email') as HTMLInputElement).value;
    const password2 = (document.getElementById('signup-password') as HTMLInputElement).value;


    if (password1 == password2) {
      this.authService.signup(email, password1, fname, lname);
    }

    // this.authService.signup(email, password, fname, lname); //.subscribe((user: User));
  }

  toggleLogin(): void {
    this.isLogin = !this.isLogin;
  }
}
