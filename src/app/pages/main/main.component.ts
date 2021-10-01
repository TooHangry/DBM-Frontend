import { Component, OnInit } from '@angular/core';
import { NavService } from 'src/app/services/nav-service/nav.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private navService: NavService) { }

  ngOnInit(): void {

    setInterval(() => {
      //toggle search
      this.navService.toggleSearch();
    }, 500)

  }

}
