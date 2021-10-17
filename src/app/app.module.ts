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
import { HomeItemsComponent } from './pages/main/components/home-items/home-items.component';
import { ItemModalComponent } from './pages/main/components/item-modal/item-modal.component';
import { ListsComponent } from './pages/lists/lists.component';
import { HomesComponent } from './pages/homes/homes.component';
import { HomeSelectionComponent } from './pages/homes/components/home-selection/home-selection.component';
import { AddHomeModalComponent } from './pages/homes/components/add-home-modal/add-home-modal.component';

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
    AddHomeModalComponent
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
