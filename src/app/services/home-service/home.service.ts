import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Home, HomeInfo } from 'src/app/models/home.models';
import { Item } from 'src/app/models/item.models';
import { EnvService } from '../env-service/env.service';
import { NavService } from '../nav-service/nav.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private envService: EnvService, private client: HttpClient, private navService: NavService) { }
  apiURL = this.envService.getBaseURL();

  getHomeInfo(home: Home): Observable<HomeInfo> {
    return this.client.get(`${this.apiURL}/home/${home.id}`).pipe(map((res: any) => res));
  }

  addItem(home: Home, item: Item): void {
    console.log(item)
    const formData = new FormData();
    formData.append('name', item.item);
    formData.append('threshold', item.alertThreshold.toString());
    formData.append('category', item.category);
    formData.append('quantity', item.quantity.toString());
    this.client.post(`${this.apiURL}/items/${home.id}`, formData).pipe(map((res: any) => res)).subscribe((home: HomeInfo) => {
      this.navService.activeHome.next(home);
      this.navService.activeCategories.next(home.categories);
      this.navService.selectedCategory.next(item.category);
    });
  }
}
