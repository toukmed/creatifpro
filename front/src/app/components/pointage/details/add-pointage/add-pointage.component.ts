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
  addPointageForm: FormGroup = new FormGroup({
    projet: new FormControl('', Validators.required),
    typeContrat: new FormControl('', Validators.required),
    totalHours: new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
    employesIds: new FormControl([], Validators.required),
  });

  projects: Projet[] = [];
  employees: Employe[] = [];
  employesIds = [];
  maxDate: Date = new Date();
  total = 0;
  currentPage = 0;
  pageSize = 5;
  projectName: '';

  constructor(
    private dialogRef: MatDialogRef<AddPointageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pointageService: ResourceService<Pointage>,
    private employeesService: ResourceService<Employe>,
    private dialog: MatDialog
  ) {
    this.projects = data['projects'];
  }

  ngOnInit(): void {
    this.addPointageForm.controls['projet'].valueChanges.subscribe((value) => {
      this.projectName = value;
      this.employesByProject(this.projectName);
    });
  }

  save() {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: 'Êtes-vous sûr de vouloir valider cette operation?',
      })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          /* this.pointageService
            .addList(this.addPointageForm.value, 'pointages/create')
            .subscribe(() => {}); */
        }
      });
  }

  close() {
    this.dialogRef.close();
  }

  displayedColumns = columns;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  onCheckboxChange(checkBox: any) {
    if (checkBox.event.checked) {
      this.employesIds.push(checkBox.id);
    } else {
      this.employesIds = this.employesIds.filter(
        (element) => element != checkBox.id
      );
    }
    this.addPointageForm.controls['employesIds'].setValue(this.employesIds);
  }

  page_changed(event: any) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.employesByProject(this.projectName);
  }

  employesByProject(event?: any) {
    this.employeesService
      .list(
        {
          size: event ? event.size : this.pageSize,
          page: event ? event.page : this.currentPage,
          projet: this.projectName,
          libelle: event.libelle,
        },
        'employes'
      )
      .subscribe((resp) => {
        this.employees = resp.content;
      });
  }
}
