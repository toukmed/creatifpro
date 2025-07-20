import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './services/guards/auth.guard';
import { ListPointageComponent } from './components/list-pointages/list-pointage.component';
import { AddPointageComponent } from './components/add-pointage/add-pointage.component';
import { EditPointageComponent } from './components/edit-pointage/edit-pointage.component';
import { VisuPointageComponent } from './components/edit-pointage/visu-pointage/visu-pointage.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'accueil',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'pointages/horaires',
    component: ListPointageComponent,
    canActivate: [authGuard],
    data: { animation: 'root' },
  },
  {
    path: 'pointages/salaries',
    component: ListPointageComponent,
    canActivate: [authGuard],
    data: { animation: 'root' },
  },
  {
    path: 'pointages/horaires/add',
    component: AddPointageComponent,
    data: { animation: 'edit' },
  },
  {
    path: 'pointages/salaries/add',
    component: AddPointageComponent,
    data: { animation: 'edit' },
  },
  {
    path: 'pointages/horaires/:id',
    component: EditPointageComponent,
    data: { animation: 'edit' },
  },
  {
    path: 'pointages/salaries/:id',
    component: EditPointageComponent,
    data: { animation: 'edit' },
  },
  {
    path: 'pointages/horaires/:id/visu',
    component: VisuPointageComponent,
    data: { animation: 'edit' },
  },
  {
    path: 'pointages/salaries/:id/visu',
    component: VisuPointageComponent,
    data: { animation: 'edit' },
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
