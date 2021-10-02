import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { UserComponent } from './pages/user/user.component';

const routes: Routes = [
  {path: 'home', component: MainComponent},
  {path: 'user', component: UserComponent},
  {path: '**', redirectTo: "/home", pathMatch: "full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
