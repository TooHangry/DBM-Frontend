import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.models';
import { EnvService } from '../env-service/env.service';
import { first, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Home } from 'src/app/models/home.models';
import { NavService } from '../nav-service/nav.service';
import { SnackbarService } from '../snackbar/snackbar.service';
import { LoadingService } from '../loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Local variables
  user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  // Constructor to inject services
  constructor(private client: HttpClient, private envService: EnvService, private router: Router,
    private navService: NavService, private snackbarService: SnackbarService, private loadingService: LoadingService) { }

  // Precondition: Nothing
  // Postcondition: Returns an observable user
  // For more on observables, see here: https://angular.io/guide/observables
  getUser(): Observable<User | null> {
    // Returns current user if already stored in frontend
    if (this.user.value) {
      // @ts-ignore
      return this.user;
    }

    // Gets current user if the token is stored in local storage
    // That is, if the user has previously logged in
    if (this.getToken().length > 0) {
      this.loginWithToken();
      return this.user;
    }

    // If neither condition is met, the user must log in.
    this.router.navigate(['/login']);
    this.navService.toggleSearch(false);
    return this.user;
  }

  // Precondition: The user must have previously logged in on the device
  // Postcondition: Requests user from backend
  loginWithToken(): void {
    const formData = new FormData();
    formData.append('token', this.getToken());

    // POST request to obtain user base on token
    this.loadingService.isLoading.next(true);
    this.client.post(`${this.getBaseURL()}/login/token`, formData).pipe(map((res: any) => res)).subscribe(
      (user: User) => {
        // If the user exists, return it
        this.logUserIn(user);
        this.loadingService.isLoading.next(false);
      },
      (error: any) => {
        // If the user does not exist, log the error
        console.log(error);
        this.loadingService.isLoading.next(false);
      }
    );
  }

  // Precondition: The validated user email and password
  // Postcondition: Logs the user in
  login(email: string, password: string): void {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    // POST request to backend with user credentials
    this.loadingService.isLoading.next(true);
    this.client.post(`${this.getBaseURL()}/login`, formData).pipe(map((res: any) => res)).subscribe(
      (user: User) => {
        // If the user is returned, 'log them in' on the frontend
        this.logUserIn(user);
        this.snackbarService.setState(true, 'Logged in Successfully', 2000);
        this.loadingService.isLoading.next(false);
      },
      (error: any) => {
        // If the user is not returned, show the error in the console
        this.snackbarService.setState(false, 'Oops! Your Credentials Don\'t Match', 3000);
        this.loadingService.isLoading.next(false);
        console.log(error);
      }
    );
  }

  // Precondition: Pre-validate email, password, first name, and last name
  // Postcondition: Creates a new user and logs them in
  signup(email: string, password: string, fname: string, lname: string): void {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('fname', fname);
    formData.append('lname', lname);
    formData.append('password', password);

    // POST request to backend to create a new user
    this.loadingService.isLoading.next(true);
    this.client.post(`${this.getBaseURL()}/signup`, formData).pipe(map((res: any) => res)).subscribe(
      (user: User) => {
        // Logs the user in if valid request
        this.logUserIn(user);
        this.snackbarService.setState(true, 'Logged in Successfully', 2000);
        this.loadingService.isLoading.next(false);

      },
      (error: any) => {
        // TODO: Show an error if the request is invalid
        this.snackbarService.setState(false, 'That Email is Already Being Used!', 3000);
        this.loadingService.isLoading.next(false);
        console.log(error);
      }
    );
  }

  // Precondition: Nothing
  // Postcondition: Deletes the user's token and reroutes to the login page
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']).then(() => {
      this.snackbarService.setState(true, 'Logged Out Successfully.', 3000);
    });
  }

  // Precondition: Nothing
  // Postcondition: Returns the token stored in local storage if it exists, else an empty string
  getToken(): string {
    const token: string | null = localStorage.getItem('token');
    return token ? token : '';
  }

  // Precondition: Nothing
  // Postcondition: Returns the user's id if it exists, else an empty string
  getUserId(): string {
    return this.user.value ? JSON.stringify(this.user.value.id) : '';
  }

  // Precondition: Nothing
  // Postcondition: Returns the user's email if it exists, else an empty string
  getUserEmail(): string {
    return this.user.value ? this.user.value.email : '';
  }

  // Precondition: The home to add
  // Postcondition: Adds the home to the user
  addHome(home: Home): void {
    if (this.user.value) {
      const homes: Home[] = this.user.value.homes ? this.user.value.homes : []
      homes.concat(home);

      this.user.next(({
        ...this.user.value,
        homes
      }));

      this.snackbarService.setState(true, `Created Home '${home.nickname}'. Reloading!`, 2500);

      setTimeout(() => {
        window.location.reload();
      }, 2000)
    }
  }

  removeInvite(home: number, email: string): void {
    this.client.delete(`${this.getBaseURL()}/removeinvite/${home}/${email}`).pipe(map(res => res)).subscribe(
      (res) => {
        this.snackbarService.setState(true, "Invite Deleted", 2500);

        const oldHome = this.navService.activeHome.value;
        if (oldHome) {
          oldHome
          this.navService.activeHome.next({
            ...oldHome,
            invites: oldHome.invites.length > 0 ? oldHome.invites.filter(inv => inv.email !== email) : oldHome.invites
          });
        }
      },
      (err) => {
        this.snackbarService.setState(false, "Could Not Delete Invite", 2500);
      });
  }

  removeUser(homeID: number, userID: number): void {
    this.client.delete(`${this.getBaseURL()}/removeuser/${homeID}/${userID}`).pipe(map(res => res)).subscribe(
      (res) => {
        this.snackbarService.setState(true, "User Removed", 2500);
        const oldHome = this.navService.activeHome.value;
        if (oldHome) {
          oldHome
          this.navService.activeHome.next({
            ...oldHome,
            users: oldHome.users.length > 0 ? oldHome.users.filter(usr => usr.id !== userID) : oldHome.users
          });
        }
      },
      (err) => {
        this.snackbarService.setState(false, "Could Not Remove User", 2500);
      });
  }

  // Precondition: The user instance returned from backend
  // Postcondition: Saves user token in local storage, sets the local variable, and reroutes to /homes
  private logUserIn(user: User): void {
    this.setToken(user.token);
    this.user.next(user);
    this.navService.toggleSearch(true);
    if (!this.router.url.includes('list'))
      this.router.navigate(['/homes']);
  }

  // Precondition: The user token
  // Postcondition: Saves the token to local storage (device only)
  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Precondition: Nothing
  // Postcondition: Returns the base url
  private getBaseURL(): string {
    return this.envService.getBaseURL();;
  }
}
