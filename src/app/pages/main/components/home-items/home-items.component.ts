import { Component, Input, OnInit } from '@angular/core';
import { HomeInfo } from 'src/app/models/home.models';

@Component({
  selector: 'app-home-items',
  templateUrl: './home-items.component.html',
  styleUrls: ['./home-items.component.scss']
})
export class HomeItemsComponent implements OnInit {

  @Input() home: HomeInfo | null = null;
  constructor() { }

  ngOnInit(): void {
  }

}
