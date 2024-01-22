import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HomeComponent } from './home/home.component';
import { MatCardModule } from '@angular/material/card';
import { NavigationComponent } from './navigation/navigation.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { PointageComponent } from './components/pointage/pointage.component';
import { PersonnelComponent } from './components/personnel/personnel.component';
import { ConsommationComponent } from './components/consommation/consommation.component';
import { ProjetComponent } from './components/projet/projet.component';
import { PaiementComponent } from './components/paiement/paiement.component';
import { CaisseComponent } from './components/caisse/caisse.component';
import { FacturationComponent } from './components/facturation/facturation.component';
import { DevisComponent } from './components/devis/devis.component';
import { GenericTableComponent } from './generic-table/generic-table.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';

const materialModules = [
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatCardModule,
  MatTooltipModule,
  MatButtonModule,
  MatPaginatorModule,
  MatTableModule,
  MatFormFieldModule,
  MatSlideToggleModule,
  MatInputModule,
  MatBadgeModule,
  MatMenuModule,
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    NavigationComponent,
    PointageComponent,
    PersonnelComponent,
    ConsommationComponent,
    ProjetComponent,
    PaiementComponent,
    CaisseComponent,
    FacturationComponent,
    DevisComponent,
    GenericTableComponent,
    LoginComponent,
  ],
  imports: [
    ...materialModules,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
