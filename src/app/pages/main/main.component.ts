import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Home, HomeInfo } from 'src/app/models/home.models';
import { Item } from 'src/app/models/item.models';
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
  flag = false;
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
    this.navService.activeHome.subscribe(home => {
        this.selectedHome.next(home);
    });
  }

  homeSelected(homeEvent: Home): void {
    this.homeService.getHomeInfo(homeEvent).subscribe((home) => {
      this.flag = true;
      const oldHome = this.homes.value.find(h => h.id == homeEvent.id);
      home.isAdmin = oldHome ? oldHome.isAdmin : false;
      home.categories = home.categories.sort((a, b) => a.localeCompare(b));
      this.selectedHome.next(home);
      this.navService.activeCategories.next(home.categories);
      this.navService.activeHome.next(home);
      const activeCategory = home.categories.length > 0 ? home.categories[0] : '';
      this.navService.selectedCategory.next(activeCategory);
    });
  }

  addItem(homeItem: any): void {
    if (this.selectedHome.value) {
      this.homeService.addItem(this.selectedHome.value, homeItem);
      this.closeAddModal();
    }
  }

  openAddModal(): void {
    const modal = (document.getElementById('add-modal') as HTMLDivElement);
    modal.style.transform = 'scale(1)';
    setTimeout(() => {
      modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    }, 250)
  }

  closeAddModal(): void {
    const modal = (document.getElementById('add-modal') as HTMLDivElement);
    modal.style.backgroundColor = 'rgba(0,0,0,0)';
    
    setTimeout(() => {
      modal.style.transform = 'scale(0)';
    }, 150)
  }

  getCategories(): string[] {
    return this.user.value ? this.user.value.categories.sort((a, b) => a.localeCompare(b)) : [];
  }

}
