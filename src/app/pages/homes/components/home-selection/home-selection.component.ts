import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Home } from 'src/app/models/home.models';

@Component({
  selector: 'app-home-selection',
  templateUrl: './home-selection.component.html',
  styleUrls: ['./home-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeSelectionComponent implements OnInit {
  // Inputs and outputs
  @Input() homes: Home[] | null = [];
  @Output() homeSelected: EventEmitter<Home> = new EventEmitter();
  @Output() addHome: EventEmitter<null> = new EventEmitter();
  
  // Local variables

  // Constructor for service injections
  constructor() { }

  // Initialization function
  ngOnInit(): void {
  }

  // Precondition: The home to select
  // Postcondition: Emits the 'homeSelected' event to parent component
  selectHome(home: Home): void {
    this.homeSelected.emit(home);
  }
}
