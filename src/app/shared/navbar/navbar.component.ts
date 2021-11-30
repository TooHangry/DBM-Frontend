import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavService } from 'src/app/services/nav-service/nav.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  // Local Variables

  // Constructor to inject services
  constructor(private router: Router, private navService: NavService) { }

  // Initialization function to run once
  ngOnInit(): void {
  }

  // Precondition: The URL to route to
  // Postcondition: Routes to the URL
  route(url: string): void {
    this.navService.state.next('items');
    this.router.navigate([url]);
  }

  isActive(path: string): boolean {
    return this.router.url.includes(path);
  }
}
