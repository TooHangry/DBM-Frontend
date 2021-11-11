import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item } from 'src/app/models/item.models';
import { List } from 'src/app/models/list.models';
import { NavService } from 'src/app/services/nav-service/nav.service';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss']
})
export class EditListComponent implements OnInit {
  // Inputs and outputs 
  @Input() list: List | null = null;

  // Local Variables
  items: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  
  constructor(private navService: NavService) { }


  ngOnInit(): void {
    this.navService.activeHome.subscribe(home => {
      if (home) {
        this.items.next(home.items);
      }
    })
  }

}
