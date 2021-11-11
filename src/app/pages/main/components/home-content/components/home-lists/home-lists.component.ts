import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { List } from 'src/app/models/list.models';
import { NavService } from 'src/app/services/nav-service/nav.service';

@Component({
  selector: 'app-home-lists',
  templateUrl: './home-lists.component.html',
  styleUrls: ['./home-lists.component.scss']
})
export class HomeListsComponent implements OnInit {
  // Input/Output

  // Local variables
  lists: BehaviorSubject<List[]> = new BehaviorSubject<List[]>([
    {
      id: 1,
      title: "Baked goods",
      taskedUserID: 7,
      items: [],
      dateDue: new Date(),
      dateTasked: new Date('11/22/2000'),
      isComplete: false
    }, {
      id: 1,
      title: "Baked goods",
      taskedUserID: 7,
      items: [],
      dateDue: new Date(),
      dateTasked: new Date('11/22/2000'),
      isComplete: false
    }, {
      id: 1,
      title: "Baked goods",
      taskedUserID: 7,
      items: [],
      dateDue: new Date(),
      dateTasked: new Date('11/22/2000'),
      isComplete: false
    }, {
      id: 1,
      title: "Baked goods",
      taskedUserID: 7,
      items: [],
      dateDue: new Date(),
      dateTasked: new Date('11/22/2000'),
      isComplete: false
    }, {
      id: 1,
      title: "Baked goods",
      taskedUserID: 7,
      items: [],
      dateDue: new Date(),
      dateTasked: new Date('11/22/2000'),
      isComplete: false
    }
  ]); 

  // Constructor
  constructor(private navService: NavService) { }

  // Initialization method to run once
  ngOnInit(): void {
  }

  getHomeUser(userID: number): string {
    if (this.navService.activeHome.value) {
      // @ts-ignore
      const users = this.navService.activeHome.value.users.filter(u => u.id === userID);
      return users.length > 0 ? users[0].fname + " " + users[0].lname : '';
    }
    return '';
  }
}
