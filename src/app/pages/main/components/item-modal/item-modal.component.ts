import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from 'src/app/models/item.models';
import { NavService } from 'src/app/services/nav-service/nav.service';

@Component({
  selector: 'app-item-modal',
  templateUrl: './item-modal.component.html',
  styleUrls: ['./item-modal.component.scss']
})
export class ItemModalComponent implements OnInit {
  
  // TODO: Query categories on start
  @Input() categories: string[] = [];
  @Output() addItem: EventEmitter<Item> = new EventEmitter();
  @Output() cancelModal: EventEmitter<null> = new EventEmitter();
  constructor(private navService: NavService) { }

  ngOnInit(): void {

  }

  save(): void {
    const itemName = (document.getElementById('item-name') as HTMLInputElement).value;
    const quantity = (document.getElementById('item-quantity') as HTMLInputElement).value;
    const threshold = (document.getElementById('item-threshold') as HTMLInputElement).value;
    const category = (document.getElementById('item-category') as HTMLSelectElement).value;

    const item: Item = {
      item: itemName,
      quantity: parseFloat(quantity),
      alertThreshold: parseFloat(threshold),
      category: category,
    };

    this.addItem.emit(item);
  }

  cancel(): void {
    this.cancelModal.emit();
  }
}
