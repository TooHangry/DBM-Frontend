import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HomeToAdd } from 'src/app/models/home.models';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { NavService } from 'src/app/services/nav-service/nav.service';

@Component({
  selector: 'app-add-home-modal',
  templateUrl: './add-home-modal.component.html',
  styleUrls: ['./add-home-modal.component.scss']
})
export class AddHomeModalComponent implements OnInit {
  emailRegx = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  @Output() addHome: EventEmitter<HomeToAdd> = new EventEmitter();
  @Output() cancelModal: EventEmitter<null> = new EventEmitter();
  constructor(private navService: NavService, private authService: AuthService) { }
  emails: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  canSave: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  flag = false;
  userEmail = '';
  
  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      if (!this.flag && user) {
        this.flag = true;
        this.userEmail = user.email;
        this.emails.next([user.email, ... this.emails.value]);
      }
    });
  }

  save(): void {
    const name = (document.getElementById('home-name') as HTMLInputElement).value;

    const home: HomeToAdd = {
      nickname: name,
      invites: this.emails.value
    };
    this.addHome.emit(home);
  }

  cancel(): void {
    this.cancelModal.emit();
  }

  checkEmail(event: any): void {
    const email = (document.getElementById('home-email') as HTMLInputElement).value;

    if (event.keyCode === 13 || event.key === 'Enter') {
      this.getEmail();
    }
    
    if (!this.emailRegx.test(email)) {
      (document.getElementById('email-container') as HTMLInputElement).style.border = '2px solid red';
    }
    else {
      (document.getElementById('email-container') as HTMLInputElement).style.border = '0';
    }
  }

  getEmail(): void {
    const email = (document.getElementById('home-email') as HTMLInputElement).value;

    if (this.emailRegx.test(email)) {
      if (!this.emails.value.includes(email)) {
        this.emails.next([email, ...this.emails.value]);
      }
      
      (document.getElementById('home-email') as HTMLInputElement).value = "";
      (document.getElementById('email-container') as HTMLInputElement).style.border = '0px';
    }
    else {
      (document.getElementById('email-container') as HTMLInputElement).style.border = '2px solid red';
    }

    this.checkSave();
  }

  removeEmail(email: string): void {
    this.emails.next(this.emails.value.filter(e => e !== email));
    this.checkSave();
  }

  checkSave(): void {
    const name = (document.getElementById('home-name') as HTMLInputElement).value;
    this.canSave.next(name.length > 0 && this.emails.value.length > 0);
  }

  notUserEmail(email: string): boolean {
    return this.userEmail.length > 0 && this.userEmail !== email;
  }
}
