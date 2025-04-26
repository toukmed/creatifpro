import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Projet } from '../../../../models/projet';
import { Employe } from '../../../../models/employe';
import { ResourceService } from '../../../../services/resource.service';
import { ConfirmDialogComponent } from '../../../../confirm-dialog/confirm-dialog.component';
import { Pointage } from '../../../../models/pointage';
import { columns } from './add-pointage.variables';

@Component({
  selector: 'app-add-pointage',
  templateUrl: './add-pointage.component.html',
  styleUrl: './add-pointage.component.scss',
})
export class AddPointageComponent implements OnInit {
  projects: Projet[] = [];
  employees: Employe[] = [];
  maxDate: Date = new Date();
  total = 0;
  currentPage = 0;
  pageSize = 5;
  projectName: string = '';
  typeContrat: string = '';
  isCreating = false;

  addPointageForm: FormGroup = new FormGroup({
    projet: new FormControl(
      this.data?.fromMainPage
        ? ''
        : this.data?.entity?.employe?.projet?.reference,
      this.data?.fromMainPage ? Validators.required : null
    ),
    typeContrat: new FormControl(
      this.data?.fromMainPage ? '' : this.data?.entity?.employe.typeContrat,
      this.data?.fromMainPage ? Validators.required : null
    ),
    pointage: new FormControl(
      this.typeContrat === 'HORAIRE' ? 8 : 1,
      this.typeContrat === 'HORAIRE' ? Validators.required : null
    ),
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
    employesIds: new FormControl(
      this.data?.fromMainPage ? [] : [this.data?.entity?.employe?.id],
      Validators.required
    ),
    commentaire: new FormControl(''),
    status: new FormControl(false),
  });

  constructor(
    private dialogRef: MatDialogRef<AddPointageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pointageService: ResourceService<Pointage>,
    private employeesService: ResourceService<Employe>,
    private dialog: MatDialog
  ) {
    this.projects = this.data['projects'];
  }

  ngOnInit(): void {
    this.typeContrat = this.data.typeContrat;
    if (!this.data?.fromMainPage) this.typeContrat = this.data?.typeContrat;
    if (!this.data?.fromMainPage)
      this.projectName = this.data?.entity?.projet?.name;
    this.addPointageForm.controls['projet'].valueChanges.subscribe((value) => {
      this.projectName = value;
      this.listEmployees(this.projectName);
    });
    this.addPointageForm.controls['typeContrat'].valueChanges.subscribe(
      (value) => {
        this.typeContrat = value;
        this.addPointageForm.controls['pointage'].setValue(
          this.typeContrat === 'HORAIRE' ? 8 : 1
        );
        this.listEmployees(this.typeContrat);
      }
    );
  }

  save() {
    this.isCreating = true;
    const startDate = this.addPointageForm.controls['startDate'].value;
    const endDate = this.addPointageForm.controls['endDate'].value;
    const employesIds = this.addPointageForm.controls['employesIds'].value;
    this.dialog
      .open(ConfirmDialogComponent, {
        data: `Les pointages seront créer pour la liste des employés suivants:<b>[${
          this.data?.fromMainPage
            ? this.filterEmployesList(employesIds)
            : this.data?.entity?.employe.nom +
              ' ' +
              this.data?.entity?.employe.prenom
        }]</b> pour la plage horaire suivante: <b>[${startDate.toLocaleDateString(
          'en-GB'
        )} - ${endDate.toLocaleDateString(
          'en-GB'
        )}]</b>. Êtes-vous sûr de vouloir valider cette operation?`,
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          if (this.addPointageForm.controls['typeContrat'].value === 'CDI') {
            this.addPointageForm.controls['pointage'].setValue(1);
          }
          this.convertToLocalTime(startDate, 'startDate');
          this.convertToLocalTime(endDate, 'endDate');
          this.pointageService
            .addList(this.addPointageForm.value, 'pointages/create')
            .subscribe(() => {
              this.dialogRef.close(true);
              this.isCreating = false;
            });
        }
      });
  }

  convertToLocalTime(date: Date, dateType: string) {
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - timezoneOffset);
    this.addPointageForm.controls[dateType].setValue(localDate.toISOString());
  }

  close() {
    this.dialogRef.close();
  }

  displayedColumns = columns;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  onCheckboxChange(employesIds: any) {
    this.addPointageForm.controls['employesIds'].setValue(employesIds);
  }

  page_changed(event: any) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.listEmployees(this.projectName);
  }

  listEmployees(event?: any) {
    this.addPointageForm.controls['employesIds'].setValue([]);
    this.employeesService
      .list(
        {
          size: event ? event.size : this.pageSize,
          page: event ? event.page : this.currentPage,
          projet: this.projectName,
          typeContrat: this.typeContrat,
          libelle: event.libelle,
        },
        'employes'
      )
      .subscribe((resp) => {
        this.employees = resp.content;
      });
  }

  filterEmployesList(ids: number[]): string[] {
    const names = ids
      .map((id) => {
        const employee = this.employees.find((emp) => emp.id === id);
        return employee ? employee.nom + ' ' + employee.prenom : null;
      })
      .filter((name) => name !== null);
    return names;
  }
}
