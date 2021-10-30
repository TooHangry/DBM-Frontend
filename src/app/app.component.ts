import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoadingService } from './services/loading/loading.service';
import { SnackbarService } from './services/snackbar/snackbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'frontend';
  loading = false;

  // Constructor for service injection
  constructor(private snackbarService: SnackbarService, private loadingService: LoadingService) {
    this.loading = false;
  }

  // Initialization function to run once
  ngOnInit(): void {
    this.snackbarService.snackbarState.subscribe(snackbar => {
      if (snackbar) {
        const snackage = document.getElementById('snakcbar') as HTMLDivElement;
        if (snackage) {
          snackage.style.transform = 'translateX(0%)';
          
          setTimeout(() => {
            snackage.style.transform = 'translateX(100%)';
          }, snackbar.durationInMS)
        }
      }
    });

    this.loadingService.isLoading.subscribe(value => this.loading = value);
  }
}
