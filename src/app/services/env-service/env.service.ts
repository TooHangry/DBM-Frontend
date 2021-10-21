import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  // Constructor for service injection
  constructor() { }

  // Precondition: Nothing
  // Postcondition: Returns the base API URL
  getBaseURL(): string {
    return environment.apiUrl;
  }
}
