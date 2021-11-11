import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from  '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { UserComponent } from './pages/user/user.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeItemsComponent } from './pages/main/components/home-content/components/home-items/home-items.component';
import { ItemModalComponent } from './pages/main/components/item-modal/item-modal.component';
import { ListsComponent } from './pages/lists/lists.component';
import { HomesComponent } from './pages/homes/homes.component';
import { HomeSelectionComponent } from './pages/homes/components/home-selection/home-selection.component';
import { AddHomeModalComponent } from './pages/homes/components/add-home-modal/add-home-modal.component';
import { SnackbarComponent } from './shared/snackbar/snackbar.component';
import { DeleteModalComponent } from './pages/main/components/delete-modal/delete-modal.component';
import { HomeContentComponent } from './pages/main/components/home-content/home-content.component';
import { HomeUsersComponent } from './pages/main/components/home-content/components/home-users/home-users.component';
import { HomeListsComponent } from './pages/main/components/home-content/components/home-lists/home-lists.component';
import { RemoveUserModalComponent } from './pages/main/components/home-content/components/home-users/remove-user-modal/remove-user-modal.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { AddUserModalComponent } from './pages/main/components/home-content/components/home-users/add-user-modal/add-user-modal.component';
import { AddListModalComponent } from './pages/main/components/home-content/components/home-lists/add-list-modal/add-list-modal.component';
import { EditListComponent } from './pages/main/components/home-content/components/home-lists/edit-list/edit-list.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavbarComponent,
    SidebarComponent,
    UserComponent,
    LoginComponent,
    HomeSelectionComponent,
    HomeItemsComponent,
    ItemModalComponent,
    ListsComponent,
    HomesComponent,
    AddHomeModalComponent,
    SnackbarComponent,
    DeleteModalComponent,
    HomeContentComponent,
    HomeUsersComponent,
    HomeListsComponent,
    RemoveUserModalComponent,
    LoadingComponent,
    AddUserModalComponent,
    AddListModalComponent,
    EditListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
