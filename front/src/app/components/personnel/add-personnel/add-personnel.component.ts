import { Component, Inject, Input, OnInit } from '@angular/core';
import { Employe, TypeContrat } from '../../../models/employe';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ResourceService } from '../../../services/resource.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { Projet } from '../../../models/projet';

@Component({
  selector: 'app-add-personnel',
  templateUrl: './add-personnel.component.html',
  styleUrl: './add-personnel.component.scss',
})
export class AddPersonnelComponent implements OnInit {
  @Input()
  isEdit = false;
  @Input()
  isVisu = false;

  employe: Employe;
  projets: Projet[];

  form: FormGroup = new FormGroup({
    id: new FormControl<number>(null),
    nom: new FormControl<string>('', Validators.required),
    prenom: new FormControl<string>('', Validators.required),
    cin: new FormControl<string>('', Validators.required),
    dateIntegration: new FormControl<Date | null>(null, Validators.required),
    numeroTelephone: new FormControl<number>(null, Validators.required),
    poste: new FormControl<string>('', Validators.required),
    typeContrat: new FormControl<string>('', Validators.required),
    projet: new FormGroup({
      reference: new FormControl<Projet>(null, Validators.required),
    }),
  });

  constructor(
    private dialogRef: MatDialogRef<AddPersonnelComponent>,
    private dialog: MatDialog,
    private service: ResourceService<Employe>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.listenToTypeContratChanges();
  }

  initForm() {
    this.employe = this.data['employe'];
    this.projets = this.data['projets'];
    console.log(this.employe);
    if (this.employe) {
      this.form.patchValue({
        id: this.employe.id || null,
        nom: this.employe.nom || '',
        prenom: this.employe.prenom || '',
        cin: this.employe.cin || '',
        dateIntegration: this.employe.dateIntegration
          ? new Date(this.employe.dateIntegration)
          : null,
        numeroTelephone: this.employe.numeroTelephone
          ? this.employe.numeroTelephone
          : 0,
        poste: this.employe.poste || '',
        typeContrat: this.employe.typeContrat || '',
        projet: this.employe.projet || null,
      });
    }
    console.log(this.isVisu);
    if (this.isVisu) {
      this.form.disable();
    }
  }

  listenToTypeContratChanges(): void {
    const typeContratControl = this.form.get('typeContrat');

    typeContratControl?.valueChanges.subscribe((value: string) => {
      if (value === 'CDI') {
        this.form.removeControl('tarifJournalier');
        if (!this.form.get('salaireMensuel')) {
          this.form.addControl(
            'salaireMensuel',
            new FormControl<number>(
              this.employe ? this.employe.salaireMensuel : null,
              Validators.required
            )
          );
        }
      } else if (value === 'HORAIRE') {
        this.form.removeControl('salaireMensuel');
        if (!this.form.get('tarifJournalier')) {
          this.form.addControl(
            'tarifJournalier',
            new FormControl<number>(
              this.employe ? this.employe.tarifJournalier : null,
              Validators.required
            )
          );
        }
      } else {
        this.form.removeControl('salaireMensuel');
        this.form.removeControl('tarifJournalier');
      }
    });
  }

  save() {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: `Etes vous sur de vouloir créer la fiche pour l'employe <b>${this.form?.controls['nom'].value}</b>`,
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.service.create(this.form.value, 'employes').subscribe(() => {
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
