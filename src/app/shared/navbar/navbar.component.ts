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

  constructor(private navService: NavService, private router: Router) { }
  shouldShowSearch: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  suggestions: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  ngOnInit(): void {
    this.navService.showSearch.subscribe(shouldShowSearch => {
      this.shouldShowSearch.next(shouldShowSearch);
    });
  }

  keyUp(event: any) {
    const navbarText = (document.getElementById('navbar-search') as HTMLInputElement).value;
    this.suggestions.next(['1', 'five', 'three', '6']);
  }

  route(url: string): void {
    this.router.navigate([url]);
  }
}
