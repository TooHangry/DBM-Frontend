import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-delete-list-modal',
  templateUrl: './delete-list-modal.component.html',
  styleUrls: ['./delete-list-modal.component.scss']
})
export class DeleteListModalComponent implements OnInit {
  // Inputs and outputs
  @Output() cancelModal: EventEmitter<null> = new EventEmitter();
  @Output() deleteItem: EventEmitter<null> = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
  }

  // Precondition: Nothing
  // Postcondition: Emits 'delete' event
  delete() {
    this.deleteItem.emit();
  }

  // Precondition: Nothing
  // Postcondition: Emits 'cancel' event
  cancel() {
    this.cancelModal.emit();
  }

}
