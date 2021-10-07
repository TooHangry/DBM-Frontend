import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Home, HomeInfo } from 'src/app/models/home.models';
import { EnvService } from '../env-service/env.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private envService: EnvService, private client: HttpClient) { }
  apiURL = this.envService.getBaseURL();

  getHomeInfo(home: Home): Observable<HomeInfo> {
    return this.client.get(`${this.apiURL}/home/${home.id}`).pipe(map((res: any) => res));
  }
}
