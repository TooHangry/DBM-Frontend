import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HomeInfo } from 'src/app/models/home.models';
import { User } from 'src/app/models/user.models';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { NavService } from 'src/app/services/nav-service/nav.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  // Local Variables
  user: User | null = null;
  categories: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  home: BehaviorSubject<HomeInfo | null> = new BehaviorSubject<HomeInfo | null>(null);

  // Constructor for service injection
  constructor(private router: Router, private navService: NavService, private authService: AuthService) { }

  // Initialization function to run once
  ngOnInit(): void {
    // Gets the current user if logged in
    this.authService.user.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });

    // Subscribes to the active home to reflect categories
    this.navService.activeHome.subscribe(home => {
        this.home.next(home);
        this.navService.activeCategories.subscribe((categories: string[]) => {
          this.categories.next(categories);
        });
    });   
  }

  // Precondition: Nothing
  // Postcondition: Routes to the user page
  navigateToUser(): void {
    this.router.navigate(['/user']);
  }

  // Precondition: Nothing
  // Postcondition: Routes to the home selection page
  chooseNewHome(): void {
    this.navService.activeHome.next(null);
    this.navService.emptySearch.next(null);
    this.router.navigate(['/homes']);
  }

  // Precondition: Nothing
  // Postcondition: Returns home nickname
  getNickname(): string {
    return this.home.value ? this.home.value.nickname : '';
  }

  // Precondition: The category to select
  // Postcondition: Sets the active category
  select(category: string): void {
    this.navService.emptySearch.next(null);
    this.navService.selectedCategory.next(category);
  }

  // Precondition: The category to check
  // Postcondition: Returns true if the current category matches the param category
  isSelected(category: string): boolean {
    return category == this.navService.selectedCategory.value;
  }

  // Preconditon: Nothing
  // Postcondition: Returns the user's name if logged in
  getName(): string {
    return this.user ? this.user.fname : '';
  }
}
