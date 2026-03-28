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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import localeFr from '@angular/common/locales/fr';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ValidationButtonsComponent } from './validation-buttons/validation-buttons.component';
import { ListPointageComponent } from './components/list-pointages/list-pointage.component';
import { CalendarPointageDialogComponent } from './components/calendar-pointage-dialog/calendar-pointage-dialog.component';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { EmployeesComponent } from './components/employees/employees.component';
import { UsersComponent } from './components/users/users.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { MaterielsComponent } from './components/materiels/materiels.component';
import { FacturesComponent } from './components/factures/factures.component';
import { StockComponent } from './components/stock/stock.component';
import { PointageRecapDialogComponent } from './components/pointage-recap-dialog/pointage-recap-dialog.component';
import { FichePaieComponent } from './components/fiche-paie/fiche-paie.component';

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
  MatSortModule,
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
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    NavigationComponent,
    LoginComponent,
    ConfirmDialogComponent,
    ValidationButtonsComponent,
    ListPointageComponent,
    CalendarPointageDialogComponent,
    EmployeesComponent,
    UsersComponent,
    ProjectsComponent,
    MaterielsComponent,
    FacturesComponent,
    StockComponent,
    PointageRecapDialogComponent,
    FichePaieComponent,
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
    MatListModule,
    MatDividerModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: tokenInterceptor, multi: true },
    { provide: CoreDateAdapter, useClass: CustomDateAdapter },
  ],
  bootstrap: [AppComponent],

  exports: [],
})
export class AppModule {}
