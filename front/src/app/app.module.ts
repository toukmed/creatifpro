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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { EditPageComponent } from './edit-page/edit-page.component';
import { VisuPageComponent } from './edit-page/visu-page/visu-page.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EditHeaderComponent } from './edit-page/edit-header/edit-header.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { MatSelectModule } from '@angular/material/select';
import { EntityFieldComponent } from './edit-page/fields/entity-field/entity-field.component';
import { EditPointageComponent } from './edit-page/edit-pointage/edit-pointage.component';
import { CommonModule } from '@angular/common';
import {
  DateAdapter as CoreDateAdapter,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CustomDateAdapter } from './services/custom-date-adapter';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

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
  MatTabsModule,
  MatDatepickerModule,
  MatDialogModule,
  ToastrModule.forRoot({
    closeButton: true,
    timeOut: 5000,
    positionClass: 'toast-top-right',
    preventDuplicates: true,
    progressBar: true,
  }),
  MatSelectModule,
  MatButtonToggleModule,
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
    EditPageComponent,
    VisuPageComponent,
    ConfirmDialogComponent,
    EditPointageComponent,
  ],
  imports: [
    ...materialModules,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    EditHeaderComponent,
    EntityFieldComponent,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: tokenInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: CoreDateAdapter, useClass: CustomDateAdapter },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
