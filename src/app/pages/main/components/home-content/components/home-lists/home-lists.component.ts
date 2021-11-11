import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { List, NewList } from 'src/app/models/list.models';
import { NavService } from 'src/app/services/nav-service/nav.service';

@Component({
  selector: 'app-home-lists',
  templateUrl: './home-lists.component.html',
  styleUrls: ['./home-lists.component.scss']
})
export class HomeListsComponent implements OnInit {
  // Input/Output
  @Output() closeAddListModal: EventEmitter<null> = new EventEmitter();
  @Output() newList: EventEmitter<NewList> = new EventEmitter();

  // Local variables
  selectedList: BehaviorSubject<List | null> = new BehaviorSubject<List | null>(null);

  lists: BehaviorSubject<List[]> = new BehaviorSubject<List[]>([
    {
      id: 1,
      title: "Baked goods",
      taskedUserID: 7,
      items: [],
      dateDue: new Date().toLocaleDateString(),
      dateTasked: new Date('11/22/2000').toDateString(),
      isComplete: false
    }, {
      id: 1,
      title: "Baked goods",
      taskedUserID: 7,
      items: [],
      dateDue: new Date().toLocaleDateString(),
      dateTasked: new Date('11/22/2000').toLocaleDateString(),
      isComplete: false
    }, {
      id: 1,
      title: "Baked goods",
      taskedUserID: 7,
      items: [],
      dateDue: new Date().toLocaleDateString(),
      dateTasked: new Date('11/22/2000').toLocaleDateString(),
      isComplete: false
    }, {
      id: 1,
      title: "Baked goods",
      taskedUserID: 7,
      items: [],
      dateDue: new Date().toLocaleDateString(),
      dateTasked: new Date('11/22/2000').toLocaleDateString(),
      isComplete: false
    }, {
      id: 1,
      title: "Baked goods",
      taskedUserID: 7,
      items: [],
      dateDue: new Date().toLocaleDateString(),
      dateTasked: new Date('11/22/2000').toLocaleDateString(),
      isComplete: false
    }
  ]); 

  // Constructor
  constructor(private navService: NavService) { }

  // Initialization method to run once
  ngOnInit(): void {
    this.navService.lists.next(this.lists.value)
  }

  selectList(list: List) {
    this.selectedList.next(list);
  }

  getHomeUser(userID: number): string {
    if (this.navService.activeHome.value) {
      // @ts-ignore
      const users = this.navService.activeHome.value.users.filter(u => u.id === userID);
      return users.length > 0 ? users[0].fname + " " + users[0].lname : '';
    }
    return '';
  }


  createNewList(event: NewList): void {
    const start = new Date(event.startDate); //'Mar 11 2015' current.getTime() = 1426060964567
    const end = new Date(event.endDate); //'Mar 11 2015' current.getTime() = 1426060964567
    const newStart = new Date(start.getTime() + 86400000); // + 1 day in ms
    const newEnd = new Date(end.getTime() + 86400000); // + 1 day in ms

    this.lists.next([...this.lists.value, {
      id: this.lists.value.length,
      title: event.title,
      taskedUserID: 7,
      items: [],
      dateTasked: newStart.toLocaleDateString(),
      dateDue: newEnd.toLocaleDateString(),
      isComplete: false
    }]);
    this.closeAddListModal.emit();

    this.navService.lists.next(this.lists.value)
  }
}
