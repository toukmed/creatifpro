import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResourceService } from '../../services/resource.service';
import { EntreeStock } from '../../models/entree-stock';
import { SortieStock } from '../../models/sortie-stock';
import { Produit, TypeProduit, UniteProduit } from '../../models/produit';
import { EtatStock } from '../../models/etat-stock';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss',
})
export class StockComponent implements OnInit {
  @ViewChild('etatPaginator') etatPaginator: MatPaginator;
  @ViewChild('produitsPaginator') produitsPaginator: MatPaginator;
  @ViewChild('entreesPaginator') entreesPaginator: MatPaginator;
  @ViewChild('sortiesPaginator') sortiesPaginator: MatPaginator;

  etatDataSource = new MatTableDataSource<EtatStock>();
  produitsDataSource = new MatTableDataSource<Produit>();
  entreesDataSource = new MatTableDataSource<EntreeStock>();
  sortiesDataSource = new MatTableDataSource<SortieStock>();

  etatDisplayedColumns: string[] = [
    'nomProduit', 'typeProduit', 'uniteProduit', 'totalEntrees', 'totalSorties', 'stockDisponible', 'valeurStock', 'statut',
  ];
  produitsDisplayedColumns: string[] = [
    'id', 'nomProduit', 'typeProduit', 'uniteProduit', 'seuilAlerte', 'description', 'actions',
  ];
  entreesDisplayedColumns: string[] = [
    'id', 'produit', 'quantite', 'prixUnitaire', 'fournisseur', 'dateEntree', 'referenceDocument', 'actions',
  ];
  sortiesDisplayedColumns: string[] = [
    'id', 'produit', 'quantite', 'project', 'dateSortie', 'demandeur', 'referenceDocument', 'actions',
  ];

  readonly typesProduit: TypeProduit[] = ['MATERIAU', 'OUTILLAGE', 'CONSOMMABLE', 'QUINCAILLERIE', 'EQUIPEMENT'];
  readonly unitesProduit: UniteProduit[] = ['LITRE', 'KG', 'METRE', 'UNITE', 'SACS', 'M2', 'M3'];

  produits: Produit[] = [];
  projects: any[] = [];

  loadingEtat = false;
  loadingProduits = false;
  loadingEntrees = false;
  loadingSorties = false;

  showProduitForm = false;
  showEntreeForm = false;
  showSortieForm = false;

  isSubmittingProduit = false;
  isSubmittingEntree = false;
  isSubmittingSortie = false;

  isEditingProduit = false;
  isEditingEntree = false;
  isEditingSortie = false;

  produitForm: FormGroup;
  entreeForm: FormGroup;
  sortieForm: FormGroup;

  // KPIs
  totalProduits = 0;
  produitsEnAlerte = 0;
  valeurTotaleStock = 0;

  constructor(
    private produitService: ResourceService<Produit>,
    private entreeService: ResourceService<EntreeStock>,
    private sortieService: ResourceService<SortieStock>,
    private etatService: ResourceService<any>,
    private projectService: ResourceService<any>,
    private dialog: MatDialog,
    private snackBar: SnackBarService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadProduits();
    this.loadProjects();
    this.loadEntrees();
    this.loadSorties();
    this.loadEtatStock();
  }

  private initForms(): void {
    this.produitForm = this.fb.group({
      id: [null],
      nomProduit: ['', Validators.required],
      typeProduit: ['', Validators.required],
      uniteProduit: ['', Validators.required],
      seuilAlerte: [null, [Validators.min(0)]],
      description: [''],
    });

    this.entreeForm = this.fb.group({
      id: [null],
      produitId: [null, Validators.required],
      quantite: [null, [Validators.required, Validators.min(0.01)]],
      prixUnitaire: [null, [Validators.min(0)]],
      fournisseur: [''],
      dateEntree: [null, Validators.required],
      referenceDocument: [''],
      commentaire: [''],
    });

    this.sortieForm = this.fb.group({
      id: [null],
      produitId: [null, Validators.required],
      quantite: [null, [Validators.required, Validators.min(0.01)]],
      projectId: [null],
      dateSortie: [null, Validators.required],
      demandeur: [''],
      referenceDocument: [''],
      commentaire: [''],
    });
  }

  // ─── Load Data ─────────────────────────────────────────────────────────

  loadEtatStock(): void {
    this.loadingEtat = true;
    this.etatService.list({}, 'stock/etat').subscribe({
      next: (data: EtatStock[]) => {
        this.etatDataSource.data = data;
        this.etatDataSource.paginator = this.etatPaginator;
        this.totalProduits = data.length;
        this.produitsEnAlerte = data.filter(e => e.enAlerte).length;
        this.valeurTotaleStock = data.reduce((sum, e) => sum + (e.valeurStock || 0), 0);
        this.loadingEtat = false;
      },
      error: () => {
        this.loadingEtat = false;
        this.snackBar.error('Erreur lors du chargement de l\'état du stock');
      },
    });
  }

  loadProduits(): void {
    this.loadingProduits = true;
    this.produitService.list({}, 'stock/produits').subscribe({
      next: (data: Produit[]) => {
        this.produits = data;
        this.produitsDataSource.data = data;
        this.produitsDataSource.paginator = this.produitsPaginator;
        this.loadingProduits = false;
      },
      error: () => {
        this.loadingProduits = false;
        this.snackBar.error('Erreur lors du chargement des produits');
      },
    });
  }

  loadProjects(): void {
    this.projectService.list({}, 'projects').subscribe({
      next: (data: any[]) => {
        this.projects = data;
      },
      error: () => {},
    });
  }

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
        this.snackBar.error('Erreur lors du chargement des entrées');
      },
    });
  }

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
        this.snackBar.error('Erreur lors du chargement des sorties');
      },
    });
  }

  // ─── Produits CRUD ─────────────────────────────────────────────────────

  toggleProduitForm(): void {
    this.showProduitForm = !this.showProduitForm;
    if (!this.showProduitForm) {
      this.produitForm.reset();
      this.isEditingProduit = false;
    }
  }

  editProduit(produit: Produit): void {
    this.isEditingProduit = true;
    this.showProduitForm = true;
    this.produitForm.patchValue(produit);
  }

  onSubmitProduit(): void {
    if (this.produitForm.invalid) return;

    this.isSubmittingProduit = true;
    const payload = this.produitForm.getRawValue();

    if (this.isEditingProduit) {
      this.produitService.update(payload, 'stock/produits').subscribe({
        next: () => {
          this.snackBar.success('Produit mis à jour avec succès');
          this.resetProduitForm();
          this.refreshAll();
        },
        error: (err) => {
          this.snackBar.error(err.error?.message || 'Erreur lors de la mise à jour');
          this.isSubmittingProduit = false;
        },
      });
    } else {
      this.produitService.create(payload, 'stock/produits').subscribe({
        next: () => {
          this.snackBar.success('Produit créé avec succès');
          this.resetProduitForm();
          this.refreshAll();
        },
        error: (err) => {
          this.snackBar.error(err.error?.message || 'Erreur lors de la création du produit');
          this.isSubmittingProduit = false;
        },
      });
    }
  }

  deleteProduit(produit: Produit): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `Voulez-vous vraiment supprimer le produit <b>${produit.nomProduit}</b> ?`,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.produitService.delete(produit.id, 'stock/produits').subscribe({
          next: () => {
            this.snackBar.success('Produit supprimé avec succès');
            this.refreshAll();
          },
          error: (err) => {
            this.snackBar.error(err.error?.message || 'Erreur lors de la suppression');
          },
        });
      }
    });
  }

  private resetProduitForm(): void {
    this.isSubmittingProduit = false;
    this.produitForm.reset();
    this.isEditingProduit = false;
    this.showProduitForm = false;
  }

  // ─── Entrees CRUD ─────────────────────────────────────────────────────

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
    this.entreeForm.patchValue({
      id: entree.id,
      produitId: entree.produit?.id,
      quantite: entree.quantite,
      prixUnitaire: entree.prixUnitaire,
      fournisseur: entree.fournisseur,
      dateEntree: entree.dateEntree,
      referenceDocument: entree.referenceDocument,
      commentaire: entree.commentaire,
    });
  }

  onSubmitEntree(): void {
    if (this.entreeForm.invalid) return;

    this.isSubmittingEntree = true;
    const payload = this.entreeForm.getRawValue();

    if (this.isEditingEntree) {
      this.entreeService.update(payload, 'stock/entrees').subscribe({
        next: () => {
          this.snackBar.success('Entrée mise à jour avec succès');
          this.resetEntreeForm();
          this.refreshAll();
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
          this.resetEntreeForm();
          this.refreshAll();
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
      data: `Voulez-vous vraiment supprimer l'entrée <b>${entree.produit?.nomProduit}</b> ?`,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.entreeService.delete(entree.id, 'stock/entrees').subscribe({
          next: () => {
            this.snackBar.success('Entrée supprimée avec succès');
            this.refreshAll();
          },
          error: (err) => {
            this.snackBar.error(err.error?.message || 'Erreur lors de la suppression');
          },
        });
      }
    });
  }

  private resetEntreeForm(): void {
    this.isSubmittingEntree = false;
    this.entreeForm.reset();
    this.isEditingEntree = false;
    this.showEntreeForm = false;
  }

  // ─── Sorties CRUD ─────────────────────────────────────────────────────

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
    this.sortieForm.patchValue({
      id: sortie.id,
      produitId: sortie.produit?.id,
      quantite: sortie.quantite,
      projectId: sortie.project?.id,
      dateSortie: sortie.dateSortie,
      demandeur: sortie.demandeur,
      referenceDocument: sortie.referenceDocument,
      commentaire: sortie.commentaire,
    });
  }

  onSubmitSortie(): void {
    if (this.sortieForm.invalid) return;

    this.isSubmittingSortie = true;
    const payload = this.sortieForm.getRawValue();

    if (this.isEditingSortie) {
      this.sortieService.update(payload, 'stock/sorties').subscribe({
        next: () => {
          this.snackBar.success('Sortie mise à jour avec succès');
          this.resetSortieForm();
          this.refreshAll();
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
          this.resetSortieForm();
          this.refreshAll();
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
      data: `Voulez-vous vraiment supprimer la sortie <b>${sortie.produit?.nomProduit}</b> ?`,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.sortieService.delete(sortie.id, 'stock/sorties').subscribe({
          next: () => {
            this.snackBar.success('Sortie supprimée avec succès');
            this.refreshAll();
          },
          error: (err) => {
            this.snackBar.error(err.error?.message || 'Erreur lors de la suppression');
          },
        });
      }
    });
  }

  private resetSortieForm(): void {
    this.isSubmittingSortie = false;
    this.sortieForm.reset();
    this.isEditingSortie = false;
    this.showSortieForm = false;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────

  private refreshAll(): void {
    this.loadProduits();
    this.loadEntrees();
    this.loadSorties();
    this.loadEtatStock();
  }
}
