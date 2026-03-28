import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './services/guards/auth.guard';
import { roleGuard } from './services/guards/role.guard';
import { ListPointageComponent } from './components/list-pointages/list-pointage.component';
import { AddPointageComponent } from './components/add-pointage/add-pointage.component';
import { EditPointageComponent } from './components/edit-pointage/edit-pointage.component';
import { VisuPointageComponent } from './components/edit-pointage/visu-pointage/visu-pointage.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { UsersComponent } from './components/users/users.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { MaterielsComponent } from './components/materiels/materiels.component';
import { StockComponent } from './components/stock/stock.component';

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
    path: 'pointages',
    component: ListPointageComponent,
    canActivate: [authGuard],
    data: { animation: 'root' },
  },
  {
    path: 'employees',
    component: EmployeesComponent,
    canActivate: [authGuard, roleGuard],
    data: { animation: 'root', roles: ['SUPER_ADMIN', 'ADMIN'] },
  },
  {
    path: 'utilisateurs',
    component: UsersComponent,
    canActivate: [authGuard, roleGuard],
    data: { animation: 'root', roles: ['SUPER_ADMIN', 'ADMIN'] },
  },
  {
    path: 'projets',
    component: ProjectsComponent,
    canActivate: [authGuard, roleGuard],
    data: { animation: 'root', roles: ['SUPER_ADMIN', 'ADMIN'] },
  },
  {
    path: 'materiels',
    component: MaterielsComponent,
    canActivate: [authGuard, roleGuard],
    data: { animation: 'root', roles: ['SUPER_ADMIN', 'ADMIN'] },
  },
  {
    path: 'stock',
    component: StockComponent,
    canActivate: [authGuard, roleGuard],
    data: { animation: 'root', roles: ['SUPER_ADMIN', 'ADMIN'] },
  },
  {
    path: 'pointages/add',
    component: AddPointageComponent,
    data: { animation: 'edit' },
  },
  {
    path: 'pointages/:id',
    component: EditPointageComponent,
    data: { animation: 'edit' },
  },
  {
    path: 'pointages/horaires/:id/visu',
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
