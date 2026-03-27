import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResourceService } from '../../services/resource.service';
import { EntreeStock, UniteProduit } from '../../models/entree-stock';
import { SortieStock } from '../../models/sortie-stock';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss',
})
export class StockComponent implements OnInit {
  @ViewChild('entreesPaginator') entreesPaginator: MatPaginator;
  @ViewChild('sortiesPaginator') sortiesPaginator: MatPaginator;

  entreesDataSource = new MatTableDataSource<EntreeStock>();
  sortiesDataSource = new MatTableDataSource<SortieStock>();

  entreesDisplayedColumns: string[] = [
    'id', 'nomComplet', 'nomProduit', 'typeProduit', 'uniteProduit', 'poids', 'quantite', 'actions',
  ];
  sortiesDisplayedColumns: string[] = [
    'id', 'nomComplet', 'nomProduit', 'typeProduit', 'uniteProduit', 'poids', 'quantite', 'chantier', 'actions',
  ];

  readonly unitesProduit: UniteProduit[] = ['LITRE', 'KG', 'METRE'];

  loadingEntrees = false;
  loadingSorties = false;

  showEntreeForm = false;
  showSortieForm = false;

  isSubmittingEntree = false;
  isSubmittingSortie = false;

  isEditingEntree = false;
  isEditingSortie = false;

  entreeForm: FormGroup;
  sortieForm: FormGroup;

  constructor(
    private entreeService: ResourceService<EntreeStock>,
    private sortieService: ResourceService<SortieStock>,
    private dialog: MatDialog,
    private snackBar: SnackBarService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadEntrees();
    this.loadSorties();
    this.initEntreeForm();
    this.initSortieForm();
  }

  private initEntreeForm(): void {
    this.entreeForm = this.fb.group({
      id: [null],
      nomComplet: ['', Validators.required],
      nomProduit: ['', Validators.required],
      typeProduit: ['', Validators.required],
      uniteProduit: ['', Validators.required],
      poids: [null, [Validators.required, Validators.min(0)]],
      quantite: [null, [Validators.required, Validators.min(0)]],
    });
  }

  private initSortieForm(): void {
    this.sortieForm = this.fb.group({
      id: [null],
      nomComplet: ['', Validators.required],
      nomProduit: ['', Validators.required],
      typeProduit: ['', Validators.required],
      uniteProduit: ['', Validators.required],
      poids: [null, [Validators.required, Validators.min(0)]],
      quantite: [null, [Validators.required, Validators.min(0)]],
      chantier: ['', Validators.required],
    });
  }

  // ─── Entrees ───────────────────────────────────────────────────────────────

  loadEntrees(): void {
    this.loadingEntrees = true;
    this.entreeService.list({}, 'stock/entrees').subscribe({
      next: (data: EntreeStock[]) => {
        this.entreesDataSource.data = data;
        this.entreesDataSource.paginator = this.entreesPaginator;
        this.loadingEntrees = false;
      },
      error: () => {
        this.loadingEntrees = false;
        this.snackBar.openBar('Erreur lors du chargement des entrées', 'error');
      },
    });
  }

  toggleEntreeForm(): void {
    this.showEntreeForm = !this.showEntreeForm;
    if (!this.showEntreeForm) {
      this.entreeForm.reset();
      this.isEditingEntree = false;
    }
  }

  editEntree(entree: EntreeStock): void {
    this.isEditingEntree = true;
    this.showEntreeForm = true;
    this.entreeForm.patchValue(entree);
  }

  onSubmitEntree(): void {
    if (this.entreeForm.invalid) return;

    this.isSubmittingEntree = true;
    const payload = this.entreeForm.getRawValue() as EntreeStock;

    if (this.isEditingEntree) {
      this.entreeService.update(payload, 'stock/entrees').subscribe({
        next: () => {
          this.snackBar.success('Entrée mise à jour avec succès');
          this.isSubmittingEntree = false;
          this.entreeForm.reset();
          this.isEditingEntree = false;
          this.showEntreeForm = false;
          this.loadEntrees();
        },
        error: (err) => {
          this.snackBar.error(err.error?.message || 'Erreur lors de la mise à jour');
          this.isSubmittingEntree = false;
        },
      });
    } else {
      this.entreeService.create(payload, 'stock/entrees').subscribe({
        next: () => {
          this.snackBar.success('Entrée créée avec succès');
          this.isSubmittingEntree = false;
          this.entreeForm.reset();
          this.showEntreeForm = false;
          this.loadEntrees();
        },
        error: (err) => {
          this.snackBar.error(err.error?.message || "Erreur lors de la création de l'entrée");
          this.isSubmittingEntree = false;
        },
      });
    }
  }

  deleteEntree(entree: EntreeStock): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `Voulez-vous vraiment supprimer l'entrée <b>${entree.nomProduit}</b> ?`,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.entreeService.delete(entree.id, 'stock/entrees').subscribe({
          next: () => {
            this.snackBar.openBar('Entrée supprimée avec succès', 'success');
            this.loadEntrees();
          },
          error: (err) => {
            this.snackBar.openBar(err.error?.message || 'Erreur lors de la suppression', 'error');
          },
        });
      }
    });
  }

  // ─── Sorties ───────────────────────────────────────────────────────────────

  loadSorties(): void {
    this.loadingSorties = true;
    this.sortieService.list({}, 'stock/sorties').subscribe({
      next: (data: SortieStock[]) => {
        this.sortiesDataSource.data = data;
        this.sortiesDataSource.paginator = this.sortiesPaginator;
        this.loadingSorties = false;
      },
      error: () => {
        this.loadingSorties = false;
        this.snackBar.openBar('Erreur lors du chargement des sorties', 'error');
      },
    });
  }

  toggleSortieForm(): void {
    this.showSortieForm = !this.showSortieForm;
    if (!this.showSortieForm) {
      this.sortieForm.reset();
      this.isEditingSortie = false;
    }
  }

  editSortie(sortie: SortieStock): void {
    this.isEditingSortie = true;
    this.showSortieForm = true;
    this.sortieForm.patchValue(sortie);
  }

  onSubmitSortie(): void {
    if (this.sortieForm.invalid) return;

    this.isSubmittingSortie = true;
    const payload = this.sortieForm.getRawValue() as SortieStock;

    if (this.isEditingSortie) {
      this.sortieService.update(payload, 'stock/sorties').subscribe({
        next: () => {
          this.snackBar.success('Sortie mise à jour avec succès');
          this.isSubmittingSortie = false;
          this.sortieForm.reset();
          this.isEditingSortie = false;
          this.showSortieForm = false;
          this.loadSorties();
        },
        error: (err) => {
          this.snackBar.error(err.error?.message || 'Erreur lors de la mise à jour');
          this.isSubmittingSortie = false;
        },
      });
    } else {
      this.sortieService.create(payload, 'stock/sorties').subscribe({
        next: () => {
          this.snackBar.success('Sortie créée avec succès');
          this.isSubmittingSortie = false;
          this.sortieForm.reset();
          this.showSortieForm = false;
          this.loadSorties();
        },
        error: (err) => {
          this.snackBar.error(err.error?.message || 'Erreur lors de la création de la sortie');
          this.isSubmittingSortie = false;
        },
      });
    }
  }

  deleteSortie(sortie: SortieStock): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `Voulez-vous vraiment supprimer la sortie <b>${sortie.nomProduit}</b> ?`,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.sortieService.delete(sortie.id, 'stock/sorties').subscribe({
          next: () => {
            this.snackBar.openBar('Sortie supprimée avec succès', 'success');
            this.loadSorties();
          },
          error: (err) => {
            this.snackBar.openBar(err.error?.message || 'Erreur lors de la suppression', 'error');
          },
        });
      }
    });
  }
}
