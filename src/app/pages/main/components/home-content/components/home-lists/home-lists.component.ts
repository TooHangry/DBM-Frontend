import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { List, NewList } from 'src/app/models/list.models';
import { ListService } from 'src/app/services/list-service/list.service';
import { NavService } from 'src/app/services/nav-service/nav.service';

@Component({
  selector: 'app-home-lists',
  templateUrl: './home-lists.component.html',
  styleUrls: ['./home-lists.component.scss']
})
export class HomeListsComponent implements OnInit {
  // Input/Output
  @Output() closeAddListModal: EventEmitter<null> = new EventEmitter();
  @Output() editMade: EventEmitter<null> = new EventEmitter();
  @Output() newList: EventEmitter<NewList> = new EventEmitter();


  // Local variables
  selectedList: BehaviorSubject<List | null> = new BehaviorSubject<List | null>(null);
  lists: BehaviorSubject<List[]> = new BehaviorSubject<List[]>([]);


  // Constructor
  constructor(private navService: NavService, private listService: ListService) { }

  // Initialization method to run once
  ngOnInit(): void {
    this.listService.lists.subscribe(homeLists => {
      this.lists.next(homeLists);
    });

    this.navService.selectedList.subscribe(list => {
      this.selectedList.next(list);
    });

  }

  selectList(list: List) {
    this.selectedList.next(list);
    this.navService.selectedList.next(list);
  }

  getHomeUser(userID: number): string {
    if (this.navService.activeHome.value) {
      // @ts-ignore
      const users = this.navService.activeHome.value.users.filter(u => u.id === userID);
      return users.length > 0 ? users[0].fname + " " + users[0].lname : '';
    }
    return '';
  }

  listEditMade(): void {
    this.navService.isEditingList.next(true);
  }

  createNewList(event: NewList): void {
    const start = new Date(event.startDate); //'Mar 11 2015' current.getTime() = 1426060964567
    const end = new Date(event.endDate); //'Mar 11 2015' current.getTime() = 1426060964567
    const newStart = new Date(start.getTime() + 86400000); // + 1 day in ms
    const newEnd = new Date(end.getTime() + 86400000); // + 1 day in ms

    const newList: List = {
      id: this.lists.value.length + 1,
      title: event.title,
      taskedUser: 0,
      taskedUserEmail: event.email,
      items: [],
      dateTasked: newStart.toLocaleDateString(),
      dateDue: newEnd.toLocaleDateString(),
      isComplete: false
    }

    this.listService.newList(newList).subscribe(list => {
      this.lists.next([...this.lists.value, list]);
      this.listService.lists.next([...this.listService.lists.value, list]);
      this.navService.lists.next(this.lists.value);
      this.closeAddListModal.emit();
      this.navService.selectedList.next(list);
    });
  }
}
