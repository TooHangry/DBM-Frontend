import { Component, OnInit } from '@angular/core';
import { NavService } from 'src/app/services/nav-service/nav.service';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private navService: NavService, private userService: UserService) { }

  ngOnInit(): void {

    this.userService.login('rec73@uakron.edu', 'password1');

    // setInterval(() => {
    //   //toggle search
    //   this.navService.toggleSearch();
    // }, 500)

  }

}
