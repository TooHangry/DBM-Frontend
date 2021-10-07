import { Component, OnInit } from '@angular/core';
import { User } from './models/user.models';
import { AuthService } from './services/auth-service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'frontend';
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe((user: User | null) => {
      if (user) {
        console.log(user)
      }
    })
  }
}
