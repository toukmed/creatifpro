import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResourceService } from '../../services/resource.service';
import { Project } from '../../models/projet';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource<Project>();
  displayedColumns: string[] = ['id', 'code', 'reference', 'actions'];

  loading = false;
  showForm = false;
  isSubmitting = false;
  isEditing = false;
  errorMessage = '';
  successMessage = '';

  projectForm: FormGroup;

  constructor(
    private service: ResourceService<Project>,
    private dialog: MatDialog,
    private snackBar: SnackBarService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.initForm();
  }

  private initForm(): void {
    this.projectForm = this.fb.group({
      id: [null],
      code: ['', Validators.required],
      reference: ['', Validators.required],
    });
  }

  loadProjects(): void {
    this.loading = true;
    this.service.list({}, 'projects').subscribe({
      next: (projects: Project[]) => {
        this.dataSource.data = projects;
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.openBar('Erreur lors du chargement des projets', 'error');
      },
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.showForm) {
      this.projectForm.reset();
      this.isEditing = false;
    }
  }

  editProject(project: Project): void {
    this.isEditing = true;
    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.projectForm.patchValue({
      id: project.id,
      code: project.code,
      reference: project.reference,
    });
  }

  onSubmit(): void {
    if (this.projectForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = this.projectForm.getRawValue() as Project;

    if (this.isEditing) {
      this.service.update(payload, 'projects').subscribe({
        next: () => {
          this.snackBar.success('Projet mis à jour avec succès');
          this.isSubmitting = false;
          this.projectForm.reset();
          this.isEditing = false;
          this.showForm = false;
          this.loadProjects();
        },
        error: (err) => {
          this.snackBar.error(err.error?.message || 'Erreur lors de la mise à jour du projet');
          this.isSubmitting = false;
        },
      });
    } else {
      this.service.create(payload, 'projects').subscribe({
        next: () => {
          this.snackBar.success('Projet créé avec succès');
          this.isSubmitting = false;
          this.projectForm.reset();
          this.showForm = false;
          this.loadProjects();
        },
        error: (err) => {
          this.snackBar.error(err.error?.message || 'Erreur lors de la création du projet');
          this.isSubmitting = false;
        },
      });
    }
  }

  deleteProject(project: Project): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `Voulez-vous vraiment supprimer le projet <b>${project.code}</b> ?`,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.service.delete(project.id, 'projects').subscribe({
          next: () => {
            this.snackBar.openBar('Projet supprimé avec succès', 'success');
            this.loadProjects();
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

