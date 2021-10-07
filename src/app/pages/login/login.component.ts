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

  ngOnInit(): void {
  }

  login(): void {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    this.authService.login(email, password); //.subscribe((user: User));
  }

  signup(): void {
    const fname = (document.getElementById('first-name') as HTMLInputElement).value;
    const lname = (document.getElementById('last-name') as HTMLInputElement).value;
    const email = (document.getElementById('signup-email') as HTMLInputElement).value;
    const password = (document.getElementById('signup-password') as HTMLInputElement).value;

    this.authService.signup(email, password, fname, lname); //.subscribe((user: User));
  }

}
