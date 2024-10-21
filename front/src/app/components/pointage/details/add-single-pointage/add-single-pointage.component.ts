import { Component, Inject, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { formatDateToString, formatToShortDate } from '../../../../utils/utils';
import { ResourceService } from '../../../../services/resource.service';
import { JourPointage } from '../../../../models/jourPointage';
import { Employe } from '../../../../models/employe';
import { SnackBarService } from '../../../../services/snack-bar.service';

@Component({
  selector: 'app-add-single-pointage',
  templateUrl: './add-single-pointage.component.html',
  styleUrl: './add-single-pointage.component.scss',
})
export class AddSinglePointageComponent implements OnInit {
  readonly formatToShortDate = formatToShortDate;
  addPointageForm: FormGroup = new FormGroup({
    id: new FormControl(),
    jourPointage: new FormControl(''),
    pointage: new FormControl('', Validators.required),
    status: new FormControl(false),
    idPointage: new FormControl(),
    commentaire: new FormControl(''),
  });

  projects: any = [];
  maxDate: Date = new Date();
  initials: string = '';

  @Input()
  datePointage: any;

  employe: Employe;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddSinglePointageComponent>,
    private jourPointageService: ResourceService<JourPointage>,
    private fb: FormBuilder,
    private snackBarService: SnackBarService
  ) {
    this.employe = data?.entity?.employe;
    this.initials =
      this.employe?.prenom.substring(0, 1) + this.employe?.nom.substring(0, 1);

    if (data.jourPointage) {
      this.initPointageForm(data?.jourPointage);
    }
  }

  ngOnInit(): void {}

  initPointageForm(jourPointage: JourPointage) {
    this.addPointageForm = this.fb.group({
      id: new FormControl(jourPointage.id, Validators.required),
      pointage: new FormControl(jourPointage.pointage, Validators.required),
      jourPointage: new FormControl(
        jourPointage.jourPointage,
        Validators.required
      ),
      status: new FormControl(jourPointage.status),
      commentaire: new FormControl(jourPointage.commentaire),
    });
  }

  close() {
    this.dialogRef.close();
  }
  save() {
    this.data.jourPointage ? this.updatePointage() : this.createPointage();
  }

  updatePointage() {
    this.jourPointageService
      .update(this.addPointageForm.value, 'jourPointages')
      .subscribe((resp) => {
        this.dialogRef.close();
        this.snackBarService.openBar(
          'Pointage du ' +
            resp.jourPointage.substring(0, 5) +
            ' est mis à jour avec succes',
          ''
        );
      });
  }

  createPointage() {
    this.addPointageForm.controls['jourPointage'].setValue(
      formatDateToString(this.data.date)
    );
    this.addPointageForm.controls['idPointage'].setValue(this.data?.entity?.id);
    this.jourPointageService
      .create(this.addPointageForm.value, 'jourPointages')
      .subscribe((resp) => {
        this.dialogRef.close();
        this.snackBarService.openBar(
          'Pointage du ' +
            resp.jourPointage.substring(0, 5) +
            ' est crée avec succes',
          ''
        );
      });
  }
}
