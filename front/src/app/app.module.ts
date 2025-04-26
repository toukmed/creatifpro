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
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, registerLocaleData } from '@angular/common';
import {
  DateAdapter as CoreDateAdapter,
  MatNativeDateModule,
} from '@angular/material/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CustomDateAdapter } from './services/custom-date-adapter';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AddPointageComponent } from './components/pointage/details/add-pointage/add-pointage.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EditPageComponent } from './edit-page/edit-page.component';
import { EditHeaderComponent } from './edit-page/edit-header/edit-header.component';
import { VisuPageComponent } from './edit-page/visu-page/visu-page.component';
import { AddSinglePointageComponent } from './components/pointage/details/add-single-pointage/add-single-pointage.component';
import { MatChipsModule } from '@angular/material/chips';
import localeFr from '@angular/common/locales/fr';
import { CalendarComponent } from './components/pointage/details/calendar/calendar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AddProjetComponent } from './components/projet/add-projet/add-projet.component';
import { EditProjetComponent } from './components/projet/edit-projet/edit-projet.component';
import { VisuProjetComponent } from './components/projet/visu-projet/visu-projet.component';
import { AddPersonnelComponent } from './components/personnel/add-personnel/add-personnel.component';
import { EditPersonnelComponent } from './components/personnel/edit-personnel/edit-personnel.component';
import { VisuPersonnelComponent } from './components/personnel/visu-personnel/visu-personnel.component';
import { ValidationButtonsComponent } from './validation-buttons/validation-buttons.component';

registerLocaleData(localeFr);

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
  MatCheckboxModule,
  MatChipsModule,
  MatCheckboxModule,
  MatSnackBarModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  NgxChartsModule,
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
    ConfirmDialogComponent,
    AddPointageComponent,
    EditPageComponent,
    VisuPageComponent,
    AddSinglePointageComponent,
    CalendarComponent,
    AddProjetComponent,
    EditProjetComponent,
    VisuProjetComponent,
    AddPersonnelComponent,
    EditPersonnelComponent,
    VisuPersonnelComponent,
    ValidationButtonsComponent,
  ],
  imports: [
    ...materialModules,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    EditHeaderComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: tokenInterceptor, multi: true },
    { provide: CoreDateAdapter, useClass: CustomDateAdapter },
  ],
  bootstrap: [AppComponent],

  exports: [],
})
export class AppModule {}
