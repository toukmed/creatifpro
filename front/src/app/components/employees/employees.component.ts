import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Project } from '../../models/projet';
import { Employe } from '../../models/employe';
import { ResourceService } from '../../services/resource.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { columns } from './employees.variables';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
})
export class EmployeesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  readonly filterForm = new FormGroup({
    project: new FormControl<string>(''),
    label: new FormControl<string>(''),
  });

  dataSource: MatTableDataSource<Employe> = new MatTableDataSource<Employe>();

  readonly endpoint: string = 'employees';
  columnsAll = columns;
  columnsPath: string[] = [...columns.map((c) => c.path), 'actions'];

  // State
  loading = false;
  showForm = false;
  isSubmitting = false;
  isEditing = false;

  // Filters
  project: string = '';
  label: string = '';

  // Lists
  projects: Project[] = [];

  // Pagination
  currentPage = 0;
  totalElements = 0;
  pageSize = 10;

  // Form
  employeeForm: FormGroup;

  constructor(
    private service: ResourceService<Employe>,
    private projectService: ResourceService<Project>,
    private dialog: MatDialog,
    private snackBar: SnackBarService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProjects();
    this.loadEmployees();

    this.filterForm.valueChanges.subscribe((formValues) => {
      this.project = formValues.project || '';
      this.label = formValues.label || '';
      this.currentPage = 0;
      this.loadEmployees();
    });
  }

  private initForm(): void {
    this.employeeForm = this.fb.group({
      id: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      cin: ['', Validators.required],
      phoneNumber: [''],
      jobRole: [''],
      dateIntegration: [null],
      hourlyRate: [null],
      salary: [null],
      projectId: [null, Validators.required],
    });
  }

  loadProjects(): void {
    this.projectService.list({}, 'projects').subscribe({
      next: (resp) => {
        this.projects = resp;
      },
      error: () => {
        this.snackBar.error('Erreur lors du chargement des projets');
      },
    });
  }

  loadEmployees(params: any = {}): void {
    this.loading = true;

    const body: any = {
      sort: { property: 'id', direction: 'ASC' },
      pageIndex: params.pageIndex ?? this.currentPage,
      pageSize: params.pageSize ?? this.pageSize,
    };

    if (this.label) {
      body.label = this.label;
    }
    if (this.project) {
      body.project = this.project;
    }

    this.service.list(body, this.endpoint).subscribe({
      next: (resp) => {
        this.dataSource.data = resp.content;
        this.currentPage = resp.number ?? 0;
        this.totalElements = resp.totalElements;
        this.loading = false;
      },
      error: () => {
        this.snackBar.error('Erreur lors du chargement des employés');
        this.loading = false;
      },
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.employeeForm.reset();
      this.isEditing = false;
    }
  }

  editEmployee(employee: any): void {
    this.isEditing = true;
    this.showForm = true;
    this.employeeForm.patchValue({
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      cin: employee.cin,
      phoneNumber: employee.phoneNumber,
      jobRole: employee.jobRole,
      dateIntegration: employee.dateIntegration,
      hourlyRate: employee.hourlyRate,
      salary: employee.salary,
      projectId: employee.project?.id ?? null,
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) return;

    this.isSubmitting = true;
    const payload = this.employeeForm.getRawValue();

    if (this.isEditing) {
      this.service.update(payload, this.endpoint).subscribe({
        next: () => {
          this.snackBar.success('Employé mis à jour avec succès');
          this.isSubmitting = false;
          this.employeeForm.reset();
          this.isEditing = false;
          this.showForm = false;
          this.loadEmployees();
        },
        error: (err) => {
          this.snackBar.error(
            err.error?.message || 'Erreur lors de la mise à jour'
          );
          this.isSubmitting = false;
        },
      });
    } else {
      this.service.create(payload, this.endpoint).subscribe({
        next: () => {
          this.snackBar.success('Employé créé avec succès');
          this.isSubmitting = false;
          this.employeeForm.reset();
          this.showForm = false;
          this.loadEmployees();
        },
        error: (err) => {
          this.snackBar.error(
            err.error?.message || "Erreur lors de la création"
          );
          this.isSubmitting = false;
        },
      });
    }
  }

  deleteEmployee(employee: Employe): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `Voulez-vous vraiment supprimer l'employé <b>${employee.firstName} ${employee.lastName}</b> ?`,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.service.delete(employee.id, this.endpoint).subscribe({
          next: () => {
            this.snackBar.success('Employé supprimé avec succès');
            this.loadEmployees();
          },
          error: (err) => {
            this.snackBar.error(
              err.error?.message || "Erreur lors de la suppression"
            );
          },
        });
      }
    });
  }

  pageChanged(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEmployees({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }

  trackBy(index: number, el: any): string {
    return el.path;
  }

  resolve(path: string, obj: any): string {
    const arr = path.split('.');
    return arr.reduce((prev: any | any[], curr: string) => {
      return prev instanceof Array
        ? prev.map((p) => p[curr]).join(',')
        : prev?.[curr];
    }, obj);
  }
}
