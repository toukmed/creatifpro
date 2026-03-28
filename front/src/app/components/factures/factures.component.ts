import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResourceService } from '../../services/resource.service';
import { ETAT_PAIEMENT_OPTIONS, Facture } from '../../models/facture';
import { Project } from '../../models/projet';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-factures',
  templateUrl: './factures.component.html',
  styleUrl: './factures.component.scss',
})
export class FacturesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource<Facture>();
  displayedColumns: string[] = ['id', 'numFacture', 'nBc', 'montantTtc', 'projectCode', 'dateFacture', 'etatPaiement', 'datePaiement', 'actions'];

  loading = false;
  showForm = false;
  isSubmitting = false;
  isEditing = false;
  errorMessage = '';
  successMessage = '';

  factureForm: FormGroup;
  etatPaiementOptions = ETAT_PAIEMENT_OPTIONS;
  projects: Project[] = [];

  constructor(
    private service: ResourceService<Facture>,
    private projectService: ResourceService<Project>,
    private dialog: MatDialog,
    private snackBar: SnackBarService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadFactures();
    this.loadProjects();
    this.initForm();
  }

  private initForm(): void {
    this.factureForm = this.fb.group({
      id: [null],
      numFacture: ['', Validators.required],
      nBc: [''],
      montantTtc: ['', Validators.required],
      projectId: [null],
      dateFacture: [null],
      etatPaiement: [null],
      datePaiement: [null],
    });
  }

  loadFactures(): void {
    this.loading = true;
    this.service.list({}, 'factures').subscribe({
      next: (factures: Facture[]) => {
        this.dataSource.data = factures;
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.openBar('Erreur lors du chargement des factures', 'error');
      },
    });
  }

  loadProjects(): void {
    this.projectService.list({}, 'projects').subscribe({
      next: (projects: Project[]) => {
        this.projects = projects;
      },
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.showForm) {
      this.factureForm.reset();
      this.isEditing = false;
    }
  }

  editFacture(facture: Facture): void {
    this.isEditing = true;
    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.factureForm.patchValue({
      id: facture.id,
      numFacture: facture.numFacture,
      nBc: facture.nBc,
      montantTtc: facture.montantTtc,
      projectId: facture.projectId,
      dateFacture: facture.dateFacture ? new Date(facture.dateFacture) : null,
      etatPaiement: facture.etatPaiement,
      datePaiement: facture.datePaiement ? new Date(facture.datePaiement) : null,
    });
  }

  onSubmit(): void {
    if (this.factureForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const raw = this.factureForm.getRawValue();
    const payload = {
      ...raw,
      dateFacture: raw.dateFacture ? this.formatDate(raw.dateFacture) : null,
      datePaiement: raw.datePaiement ? this.formatDate(raw.datePaiement) : null,
    } as Facture;

    if (this.isEditing) {
      this.service.update(payload, 'factures').subscribe({
        next: () => {
          this.snackBar.success('Facture mise à jour avec succès');
          this.isSubmitting = false;
          this.factureForm.reset();
          this.isEditing = false;
          this.showForm = false;
          this.loadFactures();
        },
        error: (err) => {
          this.snackBar.error(err.error?.message || 'Erreur lors de la mise à jour de la facture');
          this.isSubmitting = false;
        },
      });
    } else {
      this.service.create(payload, 'factures').subscribe({
        next: () => {
          this.snackBar.success('Facture créée avec succès');
          this.isSubmitting = false;
          this.factureForm.reset();
          this.showForm = false;
          this.loadFactures();
        },
        error: (err) => {
          this.snackBar.error(err.error?.message || 'Erreur lors de la création de la facture');
          this.isSubmitting = false;
        },
      });
    }
  }

  getEtatPaiementLabel(etat: string): string {
    return this.etatPaiementOptions.find(o => o.value === etat)?.label ?? etat;
  }

  deleteFacture(facture: Facture): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `Voulez-vous vraiment supprimer la facture <b>${facture.numFacture}</b> ?`,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.service.delete(facture.id, 'factures').subscribe({
          next: () => {
            this.snackBar.openBar('Facture supprimée avec succès', 'success');
            this.loadFactures();
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

  private formatDate(date: any): string {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

