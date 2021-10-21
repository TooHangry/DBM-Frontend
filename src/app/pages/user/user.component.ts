import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  // Constructor for service injections
  constructor(private authService: AuthService) { }

  // Initialization function to run once
  ngOnInit(): void {
    this.authService.logout();
  }
}
