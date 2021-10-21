import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Home, HomeInfo, HomeToAdd } from 'src/app/models/home.models';
import { Item } from 'src/app/models/item.models';
import { AuthService } from '../auth-service/auth.service';
import { EnvService } from '../env-service/env.service';
import { NavService } from '../nav-service/nav.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  // Constructor for service injections
  constructor(private envService: EnvService, private client: HttpClient, private navService: NavService, private authService: AuthService) { }

  // Precondition: The home to query
  // Postcondition: Returns an obervable with the home details and items
  // For more on Angular observables, see here: https://angular.io/guide/observables
  getHomeInfo(home: Home): Observable<HomeInfo> {
    return this.client.get(`${this.getBaseURL()}/home/${home.id}`).pipe(map((res: any) => res));
  }

  // Precondition: The home instance and the item to create
  // Postcondition: Creats a new item in the home
  addItem(home: Home, item: Item): void {
    const formData = new FormData();
    formData.append('name', item.item);
    formData.append('threshold', item.alertThreshold.toString());
    formData.append('category', item.category);
    formData.append('quantity', item.quantity.toString());

    // POST request to backend to create a new item
    this.client.post(`${this.getBaseURL()}/items/${home.id}`, formData).pipe(map((res: any) => res)).subscribe((home: HomeInfo) => {
      // Sets the active category to the new item category, adds the item to the frontend-instance of the home
      this.navService.activeHome.next(home);
      this.navService.activeCategories.next(home.categories);
      this.navService.selectedCategory.next(item.category);
    });
  }

  // Precondition: The new home instance to add
  // Postcondition: Creates a new home
  createHome(homeToAdd: HomeToAdd): void {
    const userID = this.authService.getUserId();
    const email = this.authService.getUserEmail();
    const formData = new FormData();
    formData.append('name', homeToAdd.nickname);
    formData.append('admin', userID.toString());
    formData.append('invites', JSON.stringify(homeToAdd.invites.filter((invite: string) => invite !== email)));

    // POST request to backend to create a new home
    this.client.post(`${this.getBaseURL()}/home/add`, formData).pipe(map((res: any) => res)).subscribe((home: Home) => {
      if (this.authService.user.value) {
        // Adds the home to the frontend list
        this.authService.addHome(home);
      }
    });
  }

  // Precondition: Nothing
  // Postcondition: Returns the API Base URL
  private getBaseURL(): string {
    return this.envService.getBaseURL();
  }
}
