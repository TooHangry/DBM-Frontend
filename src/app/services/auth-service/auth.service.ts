import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.models';
import { EnvService } from '../env-service/env.service';
import { first, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Home } from 'src/app/models/home.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(private client: HttpClient, private envService: EnvService, private router: Router) { }
  baseURL = this.envService.getBaseURL();

  getUser(): Observable<User | null> {
    if (this.user.value) {
      // @ts-ignore
      return this.user;
    }

    if(this.getToken().length > 0) {
      this.loginWithToken();
      this.user;
    }

    this.router.navigate(['/login']);
    return this.user;
  }

  loginWithToken(): void {
    const formData = new FormData();
    formData.append('token', this.getToken());
    this.client.post(`${this.baseURL}/login/token`, formData).pipe(map((res: any) => res)).subscribe(
      (user: User) => {
        this.logUserIn(user);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  login(email: string, password: string): void {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    this.client.post(`${this.baseURL}/login`, formData).pipe(map((res: any) => res)).subscribe(
        (user: User) => {
          this.logUserIn(user);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  signup(email: string, password: string, fname: string, lname: string): void {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('fname', fname);
    formData.append('lname', lname);
    formData.append('password', password);

    this.client.post(`${this.baseURL}/signup`, formData).pipe(map((res: any) => res)).subscribe(
        (user: User) => {
          this.logUserIn(user);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken(): string {
    const token : string | null = localStorage.getItem('token');
    return token ? token : '';
  }

  getUserId(): string {
    return this.user.value ? JSON.stringify(this.user.value.id) : '';
  }

  getUserEmail(): string {
    return this.user.value ? this.user.value.email : '';
  }

  addHome(home: Home): void {
    if (this.user.value) {
      const homes: Home[] = this.user.value.homes ? this.user.value.homes : []
      homes.concat(home);

      this.user.next(({
        ...this.user.value,
        homes
      }));
      window.location.reload(); // Find a way to update home selection
    }
  }

  private logUserIn(user: User): void {
    this.setToken(user.token);
    this.user.next(user);
    this.router.navigate(['/homes']);
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }
}
