import { Component, Inject, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ResourceService } from '../../../services/resource.service';
import { Projet } from '../../../models/projet';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-projet',
  templateUrl: './add-projet.component.html',
  styleUrl: './add-projet.component.scss',
})
export class AddProjetComponent {
  @Input()
  isEdit = false;
  @Input()
  isVisu = false;

  projet: Projet;

  form: FormGroup = new FormGroup({
    id: new FormControl(),
    nom: new FormControl<string>('', Validators.required),
    reference: new FormControl<string>('', Validators.required),
    ville: new FormControl<string>('', Validators.required),
    dateDemarrage: new FormControl<Date | null>(null, Validators.required),
  });

  constructor(
    private dialogRef: MatDialogRef<AddProjetComponent>,
    private dialog: MatDialog,
    private service: ResourceService<Projet>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initForm();
  }

  initForm() {
    if (this.data) {
      this.form.patchValue({
        id: this.data.id || null,
        nom: this.data.nom || '',
        reference: this.data.reference || '',
        ville: this.data.ville || '',
        dateDemarrage: this.data.dateDemarrage
          ? new Date(this.data.dateDemarrage)
          : null,
      });
    }
    if (this.isVisu) {
      this.form.disable();
    }
  }

  save() {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: `Etes vous sur de vouloir créer le projet <b>${this.form?.controls['nom'].value}</b>`,
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.service.create(this.form.value, 'projets').subscribe(() => {
            this.dialogRef.close({ success: true });
          });
        } else {
          this.close();
        }
      });
  }

  close() {
    this.dialogRef.close();
  }
}
