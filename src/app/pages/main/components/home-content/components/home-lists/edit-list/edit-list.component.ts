import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HomeInfo } from 'src/app/models/home.models';
import { Item } from 'src/app/models/item.models';
import { List } from 'src/app/models/list.models';
import { ListService } from 'src/app/services/list-service/list.service';
import { NavService } from 'src/app/services/nav-service/nav.service';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss']
})
export class EditListComponent implements OnInit {
  // Inputs and outputs 
  @Output() editMade: EventEmitter<null> = new EventEmitter();

  // Local Variables
  items: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  list: BehaviorSubject<List | null> = new BehaviorSubject<List | null>(null);
  home: HomeInfo | null = null;
  constructor(private navService: NavService, private listService: ListService) { }

  ngOnInit(): void {
    this.navService.activeHome.subscribe(home => {
      if (home) {
        this.home = home;
        this.items.next(home.items.filter(item => !item.isInAList));
      }
    });

    this.navService.selectedList.subscribe(list => {
      this.list.next(list);
      this.items.next(this.home?.items.filter(item => !item.isInAList) ?? []);
    })

    this.navService.isEditingList.subscribe(isEditing => {
      if (!isEditing) {
        const div = document.getElementById('list') as HTMLDivElement;
        if (div) {
          div.style.border = '0px solid black';
        }
      }
    })
  }

  switchToList(item: Item): void {
    if (this.list) {
      const current = this.list.value;
      if (current) {
        current.items = [...current.items, item];
        this.list.next(current);
        this.items.next(this.items.value.filter(i => i.id !== item.id));
        this.listService.makeChange(current);
        this.changeMade();
      }


    }
  }

  switchToHome(item: Item): void {
    const current = this.list.value;

    if (current) {
      current.items = current.items.filter(i => i.id !== item.id);
      this.list.next(current);
      this.items.next([...this.items.value, item]);
      this.changeMade();
    }
  }

  private changeMade(): void {
    (document.getElementById('list') as HTMLDivElement).style.border = '1px solid #4fd64f';
    this.editMade.emit();
  }

  // Precondition: The item to increase and button event
  // Postcondition: Marks the item and emits it
  increaseThresholdValue(event: any, item: Item): void {
    event.stopPropagation();
    this.list.value?.items.forEach(i => {
      if (item.id == i.id) {
        ++i.needed;
        this.editMade.emit();
      }
    });
  }

  // Precondition: The item to deacrease and button event
  // Postcondition: Marks the item and emits it
  decreaseThresholdValue(event: any, item: Item): void {
    event.stopPropagation();
    if (item.needed > 0) {
      this.list.value?.items.forEach(i => {
        if (item.id == i.id) {
          --i.needed;
          this.editMade.emit();
        }
      });
    }
  }
}
