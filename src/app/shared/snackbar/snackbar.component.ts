import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {
  // Local variables
  header: BehaviorSubject<string> = new BehaviorSubject<string>('Failure!');
  content: BehaviorSubject<string> = new BehaviorSubject<string>('Item could not be added');
  isSuccess: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  constructor(private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.snackbarService.snackbarState.subscribe(snackbar => {
      if(snackbar) {
        this.isSuccess.next(snackbar.isSuccess);
        this.header.next(snackbar.isSuccess ? 'Success!' : 'Failure.');
        this.content.next(snackbar.message);
      }
    })
  }

}
