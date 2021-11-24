import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HomeInfo } from 'src/app/models/home.models';
import { Item } from 'src/app/models/item.models';
import { List } from 'src/app/models/list.models';
import { EnvService } from '../env-service/env.service';
import { LoadingService } from '../loading/loading.service';
import { NavService } from '../nav-service/nav.service';
import { SnackbarService } from '../snackbar/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(private navService: NavService, private client: HttpClient, private envService: EnvService, private snackBar: SnackbarService, private loadingService: LoadingService) {
  }
  baseURL = this.envService.getBaseURL();
  lists: BehaviorSubject<List[]> = new BehaviorSubject<List[]>([]);
  initialLists: List[] = [];

  getListsForHome(homeID: number): Observable<List[]> {
    this.client.get(`${this.baseURL}/lists/home/${homeID}`).pipe(map((res: any) => res)).subscribe(
      (lists: List[]) => {

        lists.forEach(val => {
          val.isComplete = val.isComplete.toString().toLowerCase().includes("t");
        });

        this.lists.next(lists);
        this.navService.lists.next(this.lists.value);

        this.lists.value.forEach(val => {
          val.isComplete = val.isComplete.toString().toLowerCase().includes("t");
          this.initialLists.push(Object.assign({}, val));
        });
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
      formData.append('user', list.taskedUser.toString())
      formData.append('title', list.title)

      this.loadingService.isLoading.next(true);
      this.client.put(`${this.baseURL}/lists/updateitems/${listToChange.id}`, formData).pipe(map((res: any) => res)).subscribe((data: List) => {
        const initialIDs = this.initialLists.find(l => l.id === list.id)?.items.map(i => i.id);
        const listIDs = data.items.map(i => i.id);
        data.isComplete = data.isComplete.toString().toLowerCase().includes("t");

        const difference = initialIDs?.filter(id => !listIDs?.includes(id));

        const oldItems = this.navService.activeHome.value?.items;

        oldItems?.forEach(item => {
          if (data.items.map(i => i.id).includes(item.id)) {
            item.isInAList = true;
          }
          else if (difference?.includes(item.id)) {
            item.isInAList = false;
          }
        });

        if (this.navService.activeHome.value) {
          const next: HomeInfo = {
            ...this.navService.activeHome.value,
            items: Object.assign([], oldItems?.map(val => Object.assign({}, val))) as Item[]
          }
          this.navService.activeHome.next(next)
        }


        const lists = this.lists.value;
        lists.forEach(l => {
          if (l.id === list?.id) {
            l.items = data.items;
            l.isComplete = data.isComplete;
          }
        });

        this.initialLists.forEach(l => {
          if (l.id === list?.id) {
            l.items = data.items;
            l.isComplete = data.isComplete;
          }
        })
        this.lists.next([...lists]);
        this.navService.selectedList.next(data);
        this.loadingService.isLoading.next(false);
        this.snackBar.setState(true, 'Updated List!', 3000);
      })
    }
  }

  removeList(id: number): void {
    this.loadingService.isLoading.next(true);
    this.client.delete(`${this.baseURL}/lists/remove/${id}`).pipe(map((res: any) => res)).subscribe(
      (lists: List[]) => {

        lists.forEach(val => {
          val.isComplete = val.isComplete.toString().toLowerCase().includes("t");
        });

        this.lists.next(lists);
        this.navService.lists.next(this.lists.value);

        this.lists.value.forEach(val => {
          val.isComplete = val.isComplete.toString().toLowerCase().includes("t");
          this.initialLists.push(Object.assign({}, val));
        });
        this.navService.selectedList.next(null);
        this.snackBar.setState(true, 'List Deleted!', 3000);
        this.loadingService.isLoading.next(false);
      },
      (err) => {
        this.snackBar.setState(false, 'Failed to Delete List', 3000);
        this.loadingService.isLoading.next(false);
      })
  }
}
