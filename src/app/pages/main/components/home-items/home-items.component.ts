import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HomeInfo } from 'src/app/models/home.models';
import { Item } from 'src/app/models/item.models';
import { NavService } from 'src/app/services/nav-service/nav.service';

@Component({
  selector: 'app-home-items',
  templateUrl: './home-items.component.html',
  styleUrls: ['./home-items.component.scss']
})
export class HomeItemsComponent implements OnInit {

  @Input() home: HomeInfo | null = null;
  @Output() addItem: EventEmitter<null> = new EventEmitter();
  items: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  constructor(private navService: NavService) { }

  ngOnInit(): void {
    this.navService.activeHome.subscribe(home => {
      this.home = home;
    })
    
    this.navService.selectedCategory.subscribe(category => {
      if (this.home) {
        this.items.next(this.home.items.filter(item => item.category === category));
      }
    })
  }

}
