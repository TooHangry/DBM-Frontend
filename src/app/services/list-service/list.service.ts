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
  initialLists: List[] = [];

  getListsForHome(homeID: number): Observable<List[]> {
    this.client.get(`${this.baseURL}/lists/home/${homeID}`).pipe(map((res: any) => res)).subscribe(
      (lists: List[]) => {
        this.lists.next(lists);
        this.navService.lists.next(this.lists.value);

        this.lists.value.forEach(val => {
          this.initialLists.push(Object.assign({}, val));
        })
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
      const lists = this.lists.value;
      const listID = this.navService.selectedList.value?.id;
      lists.forEach(list => {
        if (listID === list.id) {
          list.items = this.initialLists.find(l => l.id === listID)?.items ?? []
        }
      });
      this.lists.next(lists);
      this.navService.selectedList.next(lists.filter(list => list.id === listID)[0] ?? null);
    }
  }

  makeChange(list: List): void {
    this.lists.value.forEach(l => {
      if (list.id == l.id) {
        l = list;
      }
    });
  }

  saveChanges(): void {
    const list = this.navService.selectedList.value;
    const listToChange = this.lists.value.find(l => l.id === list?.id);
    if (listToChange && list) {

      const formData = new FormData();
      formData.append('items', JSON.stringify(list.items))

      this.client.put(`${this.baseURL}/lists/updateitems/${listToChange.id}`, formData).pipe(map((res: any) => res)).subscribe((data: List) => {

        const initialIDs = this.initialLists.find(l => l.id === list.id)?.items.map(i => i.id);
        const listIDs = data.items.map(i => i.id);

        const difference = initialIDs?.filter(id => !listIDs?.includes(id));

        this.navService.activeHome.value?.items.forEach(item => {
          if (data.items.map(i => i.id).includes(item.id)) {
            item.isInAList = true;
          }
          else if (difference?.includes(item.id)) {
            item.isInAList = false;
          }
        });



        const lists = this.lists.value;
        lists.forEach(l => {
          if (l.id === list?.id) {
            l.items = data.items;
          }
        });

        this.initialLists.forEach(l => {
          if (l.id === list?.id) {
            l.items = data.items;
          }
        })
        this.lists.next([...lists]);
        this.navService.selectedList.next(data);
      })
    }
  }
}
