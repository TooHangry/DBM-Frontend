import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Home, HomeInfo } from 'src/app/models/home.models';
import { User } from 'src/app/models/user.models';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { HomeService } from 'src/app/services/home-service/home.service';
import { NavService } from 'src/app/services/nav-service/nav.service';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  selectedHome: BehaviorSubject<HomeInfo | null> = new BehaviorSubject<HomeInfo | null>(null);
  homes: BehaviorSubject<Home[]> = new BehaviorSubject<Home[]>([]);
  
  constructor(private navService: NavService, private homeService: HomeService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUser().subscribe((user: User | null) => {
      if (user) {
        this.user.next(user);
        if (user.homes) {
          this.homes.next(user.homes);
        }
      }
    });
  }

  homeSelected(homeEvent: Home): void {
    this.homeService.getHomeInfo(homeEvent).subscribe((home) => {
      console.table(home);
      const oldHome = this.homes.value.find(h => h.id == homeEvent.id);
      home.isAdmin = oldHome ? oldHome.isAdmin : false;
      this.selectedHome.next(home);
    })
  }

}
