import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() editMade: EventEmitter<null> = new EventEmitter();

  // Local Variables
  items: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);

  constructor(private navService: NavService) { }

  ngOnInit(): void {
    this.navService.activeHome.subscribe(home => {
      if (home) {
        this.items.next(home.items);
      }
    });

    this.navService.isEditingList.subscribe(isEditing => {
      if (!isEditing) {
        const div = document.getElementById('list') as HTMLDivElement;
        if (div) {
          div.style.border = '0px solid black';
          console.log(isEditing)
        }
      }
    })
  }

  switchToList(item: Item): void {
    if (this.list) {
      this.list.items = [...this.list.items, item];
      this.items.next(this.items.value.filter(i => i.id !== item.id));
      this.changeMade();
    }
  }

  switchToHome(item: Item): void {
    if (this.list) {
      this.list.items = this.list.items.filter(i => i.id !== item.id);
      this.items.next([...this.items.value, item]);
      this.changeMade();
    }
  }

  private changeMade(): void {
    (document.getElementById('list') as HTMLDivElement).style.border = '1px solid #4fd64f';
    this.editMade.emit();
  }
}
