import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  // Local Variables

  // Constructor to inject services
  constructor(private router: Router) { }

  // Initialization function to run once
  ngOnInit(): void {
  }

  // Precondition: The URL to route to
  // Postcondition: Routes to the URL
  route(url: string): void {
    this.router.navigate([url]);
  }

  isActive(path: string): boolean {
    return this.router.url.includes(path);
  }
}
