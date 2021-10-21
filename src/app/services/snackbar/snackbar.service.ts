import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Snackbar } from 'src/app/models/snackbar.models';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor() { }
  snackbarState: BehaviorSubject<Snackbar | null> = new BehaviorSubject<Snackbar | null>(null);

  setState(isSuccess: boolean, message: string, durationInMS: number) {
    const snackbar: Snackbar = {
      isSuccess,
      message,
      durationInMS
    };
    this.snackbarState.next(snackbar);
  }
  
}
