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

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: '/accueil', pathMatch: 'full' },
      { path: 'accueil', component: HomeComponent },
      {
        path: 'pointages',
        component: PointageComponent,
        data: { animation: 'root' },
      },
      {
        path: 'personnels',
        component: PersonnelComponent,
        data: { animation: 'root' },
      },
      {
        path: 'consommations',
        component: ConsommationComponent,
        data: { animation: 'root' },
      },
      {
        path: 'projets',
        component: ProjetComponent,
        data: { animation: 'root' },
      },
      {
        path: 'paiements',
        component: PaiementComponent,
        data: { animation: 'root' },
      },
      {
        path: 'caisses',
        component: CaisseComponent,
        data: { animation: 'root' },
      },
      {
        path: 'devis',
        component: DevisComponent,
        data: { animation: 'root' },
      },
      {
        path: 'facturations',
        component: FacturationComponent,
        data: { animation: 'root' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
