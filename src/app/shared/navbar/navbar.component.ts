import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { NavService } from 'src/app/services/nav-service/nav.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  // Local Variables
  shouldShowSearch: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  // Constructor to inject services
  constructor(private navService: NavService, private router: Router) { }

  // Initialization function to run once
  ngOnInit(): void {
    // Subscribes to visibility property
    this.navService.showSearch.subscribe(shouldShowSearch => {
      this.shouldShowSearch.next(shouldShowSearch);
    });

    // Clears the search bar if triggered
    this.navService.emptySearch.subscribe(() => {
      const searchBar = document.getElementById('navbar-search') as HTMLInputElement;
      if (searchBar) {
        searchBar.value = '';
      }
    })
  }

  // Precondition: A keyup event (From HTML)
  // Postcondition: Emits a filter event on the serach property
  keyUp(event: any) {
    const searchBar = document.getElementById('navbar-search') as HTMLInputElement;
    if (searchBar) {
      const navbarText = searchBar.value;
      this.navService.activeSearch.next(navbarText.toLowerCase());
    }

  }

  // Precondition: The URL to route to
  // Postcondition: Routes to the URL
  route(url: string): void {
    this.router.navigate([url]);
  }
}
