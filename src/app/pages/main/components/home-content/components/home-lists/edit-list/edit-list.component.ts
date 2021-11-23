import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HomeInfo } from 'src/app/models/home.models';
import { Item } from 'src/app/models/item.models';
import { List } from 'src/app/models/list.models';
import { ListService } from 'src/app/services/list-service/list.service';
import { NavService } from 'src/app/services/nav-service/nav.service';
import { closeModal, openModal } from 'src/app/utils/animations.utils';
import { pascalCase } from 'src/app/utils/casing.utils';

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
  isEditing = false;
  newUser = 0;
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
      this.isEditing = isEditing;
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

  // Precondition: The name of the item to transform
  // Postcondition: Converts the item name to have capital letters at the start of each word
  getPascalCase(itemName: string): string {
    return pascalCase(itemName);
  }

  getUser(): string {
    return this.list.value ? this.list.value.taskedUserEmail ?? '' : '';
  }

  getUsersInHome(): any[] {
    return this.navService.activeHome.value ? this.navService.activeHome.value.users.map(u => ({ email: u.email, id: u.id })) : [];
  }

  onOptionsSelected(value: string) {
    if (this.list.value)
      this.list.value.taskedUser = parseInt(value);

    this.editMade.emit();
  }

  changeTitle(title: string): void {
    if (this.list.value)
      this.list.value.title = title;

    this.editMade.emit();
  }

  openDeleteModal(): void {
    const modal = (document.getElementById('close-delete-modal') as HTMLDivElement)
    openModal(modal);
  }

  closeDeleteModal(): void {
    const modal = (document.getElementById('close-delete-modal') as HTMLDivElement)
    closeModal(modal)
  }

  deleteList(): void {
    console.log('remove');
    this.closeDeleteModal();

    const list = this.navService.selectedList.value;
    if (list) {
      const listItems = list.items.map(i => i.id);
      this.navService.activeHome.value?.items.forEach(i => {
        if (listItems.includes(i.id)) {
          i.isInAList = false;
        }
      })
      this.listService.removeList(list.id)
    }    
  }
}