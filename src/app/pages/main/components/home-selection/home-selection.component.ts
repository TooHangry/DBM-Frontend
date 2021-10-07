import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Home } from 'src/app/models/home.models';

@Component({
  selector: 'app-home-selection',
  templateUrl: './home-selection.component.html',
  styleUrls: ['./home-selection.component.scss']
})
export class HomeSelectionComponent implements OnInit {

  @Input() homes: Home[] | null = [];
  @Output() homeSelected: EventEmitter<Home> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  selectHome(home: Home): void {
    this.homeSelected.emit(home);
  }
}
