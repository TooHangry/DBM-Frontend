import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { List, NewList } from 'src/app/models/list.models';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ListService } from 'src/app/services/list-service/list.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { NavService } from 'src/app/services/nav-service/nav.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { pascalCase } from 'src/app/utils/casing.utils';

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
  constructor(private navService: NavService, private listService: ListService,
    private snackBarService: SnackbarService, private loadingService: LoadingService,
    private authService: AuthService) { }

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
      return this.getPascal(users.length > 0 ? users[0].fname + " " + users[0].lname : '');
    }
    return '';
  }

  listEditMade(): void {
    this.navService.isEditingList.next(true);
  }

  createNewList(event: NewList): void {
    const end = new Date(event.endDate); //'Mar 11 2015' current.getTime() = 1426060964567
    const newEnd = new Date(end.getTime() + 86400000); // + 1 day in ms

    const newList: List = {
      id: this.lists.value.length + 1,
      title: event.title,
      taskedUser: 0,
      taskedUserEmail: event.email,
      homeID: 0,
      homeName: '',
      items: [],
      dateTasked: new Date().toLocaleDateString(),
      dateDue: newEnd.toLocaleDateString(),
      isComplete: false
    }

    this.loadingService.isLoading.next(true);
    this.listService.newList(newList).subscribe(list => {
      this.lists.next([...this.lists.value, list]);
      this.listService.lists.next([...this.listService.lists.value, list]);

      list.isComplete = list.isComplete.toString().toLowerCase().includes("t");
      this.listService.initialLists.push(Object.assign({}, list));
      this.snackBarService.setState(true, 'Created List ' + this.getPascal(list.title) + '!', 3000);

      this.navService.lists.next(this.lists.value);
      this.closeAddListModal.emit();
      this.navService.selectedList.next(list);
      this.loadingService.isLoading.next(false);
    });
  }

  getDate(dateString: string): string {
    const d = new Date(dateString);
    return d.toLocaleDateString();
  }

  isAdmin(): boolean {
    return this.authService.getUserEmail() === this.navService.activeHome.value?.admin
  }

  isOverdue(dateString: string): boolean {
    const d = new Date(dateString);
    return d <= new Date();
  }

  isComplete(list: List): string {
    let isActive = false;

    list.items.forEach(i => {
      if (i.needed > i.quantity) 
        isActive = true;
    })

    return isActive ? 'Active' : 'Complete';
  }

  getPascal(initial: string): string {
    return pascalCase(initial);
  }
}
