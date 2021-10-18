import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Home, HomeInfo, HomeToAdd } from 'src/app/models/home.models';
import { User } from 'src/app/models/user.models';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { HomeService } from 'src/app/services/home-service/home.service';
import { NavService } from 'src/app/services/nav-service/nav.service';

@Component({
  selector: 'app-homes',
  templateUrl: './homes.component.html',
  styleUrls: ['./homes.component.scss']
})
export class HomesComponent implements OnInit {

  selectedHome: BehaviorSubject<HomeInfo | null> = new BehaviorSubject<HomeInfo | null>(null);
  homes: BehaviorSubject<Home[]> = new BehaviorSubject<Home[]>([]);
  user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(private navService: NavService, private homeService: HomeService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.navService.activeHome.next(null);

    this.authService.getUser().subscribe((user: User | null) => {
      if (user) {
        this.user.next(user);
        if (user.homes) {
          this.homes.next(user.homes);
        }
      }
    });
    this.navService.activeHome.subscribe(home => {
        this.selectedHome.next(home);
    });
  }

  homeSelected(homeEvent: Home): void {
    this.homeService.getHomeInfo(homeEvent).subscribe((home) => {
      const oldHome = this.homes.value.find(h => h.id == homeEvent.id);
      home.isAdmin = oldHome ? oldHome.isAdmin : false;
      home.categories = home.categories.sort((a, b) => a.localeCompare(b));
      this.selectedHome.next(home);
      this.navService.activeCategories.next(home.categories);
      this.navService.activeHome.next(home);
      const activeCategory = home.categories.length > 0 ? home.categories[0] : '';
      this.navService.selectedCategory.next(activeCategory);
      this.router.navigate(['/home']);
    });
  }

  openAddModal(): void {
    const modal = (document.getElementById('add-home-modal') as HTMLDivElement);
    modal.style.transform = 'scale(1)';
    setTimeout(() => {
      modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    }, 250)
  }

  closeAddModal(): void {
    const modal = (document.getElementById('add-home-modal') as HTMLDivElement);
    modal.style.backgroundColor = 'rgba(0,0,0,0)';
    
    setTimeout(() => {
      modal.style.transform = 'scale(0)';
    }, 150)
  }

  createHome(event: HomeToAdd): void {
    this.homeService.createHome(event);
    this.closeAddModal();
  }
}
