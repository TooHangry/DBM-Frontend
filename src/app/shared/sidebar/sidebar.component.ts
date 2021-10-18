import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HomeInfo } from 'src/app/models/home.models';
import { NavService } from 'src/app/services/nav-service/nav.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  categories: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  home: BehaviorSubject<HomeInfo | null> = new BehaviorSubject<HomeInfo | null>(null);
  constructor(private router: Router, private navService: NavService) { }

  ngOnInit(): void {
    this.navService.activeHome.subscribe(home => {
        this.home.next(home);
        this.navService.activeCategories.subscribe((categories: string[]) => {
          this.categories.next(categories);
        });
    });   
  }

  navigateToUser(): void {
    this.router.navigate(['/user']);
  }

  chooseNewHome(): void {
    this.navService.activeHome.next(null);
    this.navService.emptySearch.next(null);
    this.router.navigate(['/homes']);
  }

  getNickname(): string {
    return this.home.value ? this.home.value.nickname : '';
  }

  select(category: string): void {
    this.navService.emptySearch.next(null);
    this.navService.selectedCategory.next(category);
  }

  isSelected(category: string): boolean {
    return category == this.navService.selectedCategory.value;
  }
}
