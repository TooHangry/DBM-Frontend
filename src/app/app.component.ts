import { Component, OnInit } from '@angular/core';
import { SnackbarService } from './services/snackbar/snackbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'frontend';

  // Constructor for service injection
  constructor(private snackbarService: SnackbarService) {}

  // Initialization function to run once
  ngOnInit(): void {
    this.snackbarService.snackbarState.subscribe(snackbar => {
      if (snackbar) {
        const snackage = document.getElementById('snakcbar') as HTMLDivElement;
        if (snackage) {
          snackage.style.transform = 'translateX(0%)';
      console.log(snackbar);
          
          setTimeout(() => {
            snackage.style.transform = 'translateX(100%)';
          }, snackbar.durationInMS)
        }
      }
    })
  }
}
