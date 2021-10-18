import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Home } from 'src/app/models/home.models';

@Component({
  selector: 'app-home-selection',
  templateUrl: './home-selection.component.html',
  styleUrls: ['./home-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeSelectionComponent implements OnInit {

  @Input() homes: Home[] | null = [];
  @Output() homeSelected: EventEmitter<Home> = new EventEmitter();
  @Output() addHome: EventEmitter<null> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  selectHome(home: Home): void {
    this.homeSelected.emit(home);
  }
}
