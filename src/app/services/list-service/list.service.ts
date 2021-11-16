import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { List } from 'src/app/models/list.models';
import { EnvService } from '../env-service/env.service';
import { NavService } from '../nav-service/nav.service';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(private navService: NavService, private client: HttpClient, private envService: EnvService) {
  }
  baseURL = this.envService.getBaseURL();
  lists: BehaviorSubject<List[]> = new BehaviorSubject<List[]>([]);


  getListsForHome(homeID: number): Observable<List[]> {

    this.client.get(`${this.baseURL}/lists/home/${homeID}`).pipe(map((res: any) => res)).subscribe(
      (lists: List[]) => {
        this.lists.next(lists);
        this.navService.lists.next(this.lists.value);
      }
    )

    return this.lists;
  }

  newList(listToCreate: List): Observable<List> {
    const home = this.navService.activeHome.value;

    if (home) {
      const user = home.users.find(u => u.email === listToCreate.taskedUserEmail)?.id ?? 0;
      const formData = new FormData();
      formData.append('title', listToCreate.title);
      formData.append('taskedUserID', user.toString());
      formData.append('dateTasked', listToCreate.dateTasked);
      formData.append('dateDue', listToCreate.dateDue);
      formData.append('isComplete', 'true');
      formData.append('home', home.id.toString());

      return this.client.post(`${this.baseURL}/lists/create`, formData).pipe(map((res: any) => res));
    }
    return of();
  }

  cancelEdits(): void {
    if (this.navService.selectedList.value) {
      // @ts-ignore
      const list = this.navService.selectedList.value;
      const lists = this.lists.value.filter(l => l.id === list.id);
      if (lists.length > 0) {
        this.navService.selectedList.next(lists[0]);
      }
    }
  }
}
