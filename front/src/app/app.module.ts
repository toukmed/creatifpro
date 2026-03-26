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
import { EditHeaderComponent } from './components/edit-pointage/edit-header/edit-header.component';
import { MatChipsModule } from '@angular/material/chips';
import localeFr from '@angular/common/locales/fr';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ValidationButtonsComponent } from './validation-buttons/validation-buttons.component';
import { ListPointageComponent } from './components/list-pointages/list-pointage.component';
import { AddPointageComponent } from './components/add-pointage/add-pointage.component';
import { AddPointageDialogComponent } from './components/add-pointage-dialog/add-pointage-dialog.component';
import { EditPointageComponent } from './components/edit-pointage/edit-pointage.component';
import { VisuPointageComponent } from './components/edit-pointage/visu-pointage/visu-pointage.component';
import { CalendarPointageDialogComponent } from './components/calendar-pointage-dialog/calendar-pointage-dialog.component';
import { MatListModule } from '@angular/material/list';
import { EmployeesComponent } from './components/employees/employees.component';

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
    AddPointageComponent,
    AddPointageDialogComponent,
    EditPointageComponent,
    VisuPointageComponent,
    CalendarPointageDialogComponent,
    EmployeesComponent,
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
