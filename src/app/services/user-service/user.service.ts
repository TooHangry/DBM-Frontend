import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../env-service/env.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private client: HttpClient, private envService: EnvService) { }
  apiBase = this.envService.getBaseURL();

  login(email: string, password: string): any {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    this.client.post(`${this.apiBase}/users/login`, formData).subscribe(x => console.log(x));
  }
}
