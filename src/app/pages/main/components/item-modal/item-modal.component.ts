import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from 'src/app/models/item.models';
import { NavService } from 'src/app/services/nav-service/nav.service';

@Component({
  selector: 'app-item-modal',
  templateUrl: './item-modal.component.html',
  styleUrls: ['./item-modal.component.scss']
})
export class ItemModalComponent implements OnInit {
  // Inputs and outputs
  @Input() categories: string[] = [];
  @Input() title: string = '';
  @Input() itemToUpdate: Item | null = null;
  @Output() addItem: EventEmitter<Item> = new EventEmitter();
  @Output() saveItem: EventEmitter<Item> = new EventEmitter();
  @Output() cancelModal: EventEmitter<null> = new EventEmitter();

  // Local variables

  // Constructor for service injection
  constructor() { }

  // Initialization function (to run once)
  ngOnInit(): void {
  }

  // Precondition: Nothing
  // Postcondition: Emits a new item event to parent component
  save(): void {

    if (this.itemToUpdate) {
      const id = this.itemToUpdate.id;
      this.itemToUpdate.item = (document.getElementById(`item-name${id}`) as HTMLInputElement).value.trim().toLowerCase();
      this.itemToUpdate.quantity = (document.getElementById(`item-quantity${id}`) as HTMLInputElement).value.trim() as unknown as number;
      this.itemToUpdate.alertThreshold = (document.getElementById(`item-threshold${id}`) as HTMLInputElement).value.trim() as unknown as number;
      this.itemToUpdate.category =(document.getElementById(`item-category${id}`) as HTMLSelectElement).value.trim();
      this.saveItem.emit(this.itemToUpdate);
      this.clearForm();
      return;
    }

    const itemName = (document.getElementById('item-name') as HTMLInputElement).value.trim().toLowerCase();
    const quantity = (document.getElementById('item-quantity') as HTMLInputElement).value.trim();
    const threshold = (document.getElementById('item-threshold') as HTMLInputElement).value.trim();
    const category = (document.getElementById('item-category') as HTMLSelectElement).value.trim();
    const item: Item = {
      item: itemName,
      quantity: parseFloat(quantity),
      alertThreshold: parseFloat(threshold),
      category: category,
    };

    this.addItem.emit(item);
    this.clearForm();
  }

  // Precondition: Activated when 'cancel' or area outside of modal is clicked
  // Postcondition: Emits the 'cancelModal' event to parent component
  cancel(): void {
    this.cancelModal.emit();
  }


  private clearForm(): void {
    (document.getElementById('item-name') as HTMLInputElement).value = "";
    (document.getElementById('item-quantity') as HTMLInputElement).value = "";
    (document.getElementById('item-threshold') as HTMLInputElement).value = "";
    (document.getElementById('item-category') as HTMLSelectElement).value = this.categories.length > 0 ? this.categories[0] : '';
  }
}
