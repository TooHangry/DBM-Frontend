import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Home, HomeInfo, HomeToAdd } from 'src/app/models/home.models';
import { User } from 'src/app/models/user.models';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { HomeService } from 'src/app/services/home-service/home.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { NavService } from 'src/app/services/nav-service/nav.service';

@Component({
  selector: 'app-homes',
  templateUrl: './homes.component.html',
  styleUrls: ['./homes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomesComponent implements OnInit {
  // Local variables
  selectedHome: BehaviorSubject<HomeInfo | null> = new BehaviorSubject<HomeInfo | null>(null);
  homes: BehaviorSubject<Home[]> = new BehaviorSubject<Home[]>([]);
  user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  // Constructor for service injections
  constructor(private navService: NavService, private homeService: HomeService, private authService: AuthService,
    private router: Router, private loadingService: LoadingService) { }

  // Initialization function (runs once)
  ngOnInit(): void {
    this.navService.activeHome.next(null);

    // Gets logged in user and subsequent homes
    this.authService.getUser().subscribe((user: User | null) => {
      if (user) {
        this.user.next(user);
        if (user.homes) {
          this.homes.next(user.homes);
        }
      }
    });

    // Sets the active home (if applicable)
    this.navService.activeHome.subscribe(home => {
        this.selectedHome.next(home);
    });
  }

  // Precondition: The home event received from child component
  // Postcondition: Selects the home as 'active'
  homeSelected(homeEvent: Home): void {
    this.loadingService.isLoading.next(true);
    this.homeService.getHomeInfo(homeEvent).subscribe((home) => {
      const oldHome = this.homes.value.find(h => h.id == homeEvent.id);
      home.isAdmin = oldHome ? oldHome.isAdmin : false;
      home.categories = home.categories.sort((a, b) => a.localeCompare(b));
      this.selectedHome.next(home);
      this.navService.activeCategories.next(home.categories);
      this.navService.activeHome.next(home);
      const activeCategory = home.categories.length > 0 ? home.categories[0] : '';
      this.navService.selectedCategory.next(activeCategory);
      
      // Routes to selected home
      this.loadingService.isLoading.next(false);
      this.router.navigate(['/home']);
    });
  }


  // Precondition: Active when 'add' floating-action button is clicked
  // Postcondition: Makes the modal visible
  openAddModal(): void {
    const modal = (document.getElementById('add-home-modal') as HTMLDivElement);
    modal.style.transform = 'scale(1)';
    setTimeout(() => {
      modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    }, 250)
  }

  // Precondition: Nothing
  // Postcondition: Hides the add modal
  closeAddModal(): void {
    const modal = (document.getElementById('add-home-modal') as HTMLDivElement);
    modal.style.backgroundColor = 'rgba(0,0,0,0)';
    
    setTimeout(() => {
      modal.style.transform = 'scale(0)';
    }, 150)
  }

  // Precondition: The homeToAddEvent (bubbled-up from child component (modal))
  // Postcondition: Creates a new home and closes modal
  createHome(event: HomeToAdd): void {
    this.homeService.createHome(event);
    this.closeAddModal();
  }
}
