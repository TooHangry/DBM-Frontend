import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from 'src/app/models/item.models';
import { List } from 'src/app/models/list.models';

@Component({
  selector: 'app-list-modal',
  templateUrl: './list-modal.component.html',
  styleUrls: ['./list-modal.component.scss']
})
export class ListModalComponent implements OnInit {
  // Inputs and outputs
  @Output() cancelModal: EventEmitter<null> = new EventEmitter();
  @Output() saveList: EventEmitter<null> = new EventEmitter();
  @Output() changeItem: EventEmitter<any> = new EventEmitter();
  @Input() list: List | null = null;
  @Input() initial: Item[] | null = [];
  
  constructor() { }

  ngOnInit(): void {
  }

  // Precondition: Nothing
  // Postcondition: Emits 'save' event
  save() {
    this.saveList.emit();
  }

  // Precondition: Nothing
  // Postcondition: Emits 'cancel' event
  cancel() {
    this.cancelModal.emit();
  }
  
  alterItem(item: Item, val: string): void {
    this.changeItem.emit({listID: this.list?.id, item: item, num: val})
  }

  isComplete(item: Item): boolean {
    const current = this.initial?.find(i => i.id === item.id);
    if (current)
      return (current.needed <= current.quantity)
    return false;
  }
}
