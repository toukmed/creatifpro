import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PointageComponent } from './components/pointage/pointage.component';
import { PersonnelComponent } from './components/personnel/personnel.component';
import { ConsommationComponent } from './components/consommation/consommation.component';
import { ProjetComponent } from './components/projet/projet.component';
import { PaiementComponent } from './components/paiement/paiement.component';
import { CaisseComponent } from './components/caisse/caisse.component';
import { DevisComponent } from './components/devis/devis.component';
import { FacturationComponent } from './components/facturation/facturation.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './services/guards/auth.guard';
import { EditPageComponent } from './edit-page/edit-page.component';
import { VisuPageComponent } from './edit-page/visu-page/visu-page.component';

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
    component: PointageComponent,
    canActivate: [authGuard],
    data: { animation: 'root' },
  },
  {
    path: 'pointages/:id',
    component: EditPageComponent,
    data: { animation: 'edit' },
  },
  {
    path: 'pointages/:id/visu',
    component: VisuPageComponent,
    data: { animation: 'edit' },
  },
  {
    path: 'employes',
    component: PersonnelComponent,
    canActivate: [authGuard],
    data: { animation: 'root' },
  },
  {
    path: 'consommations',
    component: ConsommationComponent,
    canActivate: [authGuard],
    data: { animation: 'root' },
  },
  {
    path: 'projets',
    component: ProjetComponent,
    canActivate: [authGuard],
    data: { animation: 'root' },
  },
  {
    path: 'paiements',
    component: PaiementComponent,
    canActivate: [authGuard],
    data: { animation: 'root' },
  },
  {
    path: 'caisses',
    component: CaisseComponent,
    canActivate: [authGuard],
    data: { animation: 'root' },
  },
  {
    path: 'devis',
    component: DevisComponent,
    canActivate: [authGuard],
    data: { animation: 'root' },
  },
  {
    path: 'facturations',
    component: FacturationComponent,
    canActivate: [authGuard],
    data: { animation: 'root' },
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
