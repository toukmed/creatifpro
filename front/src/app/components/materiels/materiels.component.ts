import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResourceService } from '../../services/resource.service';
import { Materiel } from '../../models/materiel';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-materiels',
  templateUrl: './materiels.component.html',
  styleUrl: './materiels.component.scss',
})
export class MaterielsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource<Materiel>();
  displayedColumns: string[] = ['id', 'nom', 'reference', 'chantier', 'actions'];

  loading = false;
  showForm = false;
  isSubmitting = false;
  isEditing = false;
  errorMessage = '';
  successMessage = '';

  materielForm: FormGroup;

  constructor(
    private service: ResourceService<Materiel>,
    private dialog: MatDialog,
    private snackBar: SnackBarService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadMateriels();
    this.initForm();
  }

  private initForm(): void {
    this.materielForm = this.fb.group({
      id: [null],
      nom: ['', Validators.required],
      reference: ['', Validators.required],
      chantier: ['', Validators.required],
    });
  }

  loadMateriels(): void {
    this.loading = true;
    this.service.list({}, 'materiels').subscribe({
      next: (materiels: Materiel[]) => {
        this.dataSource.data = materiels;
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.openBar('Erreur lors du chargement des matériels', 'error');
      },
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.showForm) {
      this.materielForm.reset();
      this.isEditing = false;
    }
  }

  editMateriel(materiel: Materiel): void {
    this.isEditing = true;
    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.materielForm.patchValue({
      id: materiel.id,
      nom: materiel.nom,
      reference: materiel.reference,
      chantier: materiel.chantier,
    });
  }

  onSubmit(): void {
    if (this.materielForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = this.materielForm.getRawValue() as Materiel;

    if (this.isEditing) {
      this.service.update(payload, 'materiels').subscribe({
        next: () => {
          this.snackBar.success('Matériel mis à jour avec succès');
          this.isSubmitting = false;
          this.materielForm.reset();
          this.isEditing = false;
          this.showForm = false;
          this.loadMateriels();
        },
        error: (err) => {
          this.snackBar.error(err.error?.message || 'Erreur lors de la mise à jour du matériel');
          this.isSubmitting = false;
        },
      });
    } else {
      this.service.create(payload, 'materiels').subscribe({
        next: () => {
          this.snackBar.success('Matériel créé avec succès');
          this.isSubmitting = false;
          this.materielForm.reset();
          this.showForm = false;
          this.loadMateriels();
        },
        error: (err) => {
          this.snackBar.error(err.error?.message || 'Erreur lors de la création du matériel');
          this.isSubmitting = false;
        },
      });
    }
  }

  deleteMateriel(materiel: Materiel): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `Voulez-vous vraiment supprimer le matériel <b>${materiel.nom}</b> ?`,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.service.delete(materiel.id, 'materiels').subscribe({
          next: () => {
            this.snackBar.openBar('Matériel supprimé avec succès', 'success');
            this.loadMateriels();
          },
          error: (err) => {
            this.snackBar.openBar(
              err.error?.message || 'Erreur lors de la suppression',
              'error'
            );
          },
        });
      }
    });
  }
}
