import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { formatDateToYMD } from '../../utils/date-utils';
import { Project } from '../../models/projet';
import { Employe } from '../../models/employe';
import { Pointage } from '../../models/pointage';
import { ResourceService } from '../../services/resource.service';
import { SnackBarService } from '../../services/snack-bar.service';

export type DialogMode = 'create' | 'edit' | 'visu';

export interface AddPointageDialogData {
  entityName: string; // 'horaires' | 'salaries'
  mode?: DialogMode;
  pointage?: any;
}

@Component({
  selector: 'app-add-pointage-dialog',
  templateUrl: './add-pointage-dialog.component.html',
  styleUrls: ['./add-pointage-dialog.component.scss'],
})
export class AddPointageDialogComponent implements OnInit {
  addPointageForm: FormGroup = new FormGroup({
    project: new FormControl(null, Validators.required),
    employees: new FormControl([], Validators.required),
    pointageDateRange: new FormGroup({
      start: new FormControl('', Validators.required),
      end: new FormControl('', Validators.required),
    }),
    totalHours: new FormControl(null, Validators.required),
    comment: new FormControl(''),
  });

  projects: Project[] = [];
  employees: Employe[] = [];
  today = new Date();
  submitting = false;
  entityName: string;
  endpoint: string;
  mode: DialogMode;

  constructor(
    private dialogRef: MatDialogRef<AddPointageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddPointageDialogData,
    private pointageService: ResourceService<Pointage>,
    private employeeService: ResourceService<Employe>,
    private projectService: ResourceService<Project>,
    private snackBar: SnackBarService
  ) {
    this.entityName = data.entityName;
    this.endpoint = 'pointages' + this.entityName;
    this.mode = data.mode || 'create';
  }

  ngOnInit(): void {
    this.listProjects();
    this.addPointageForm.get('project')!.valueChanges.subscribe(() => {
      this.listEmployees();
    });

    if ((this.mode === 'edit' || this.mode === 'visu') && this.data.pointage) {
      this.populateForm(this.data.pointage);
    }
    if (this.mode === 'visu') {
      this.addPointageForm.disable();
    }
  }

  private populateForm(pointage: any): void {
    this.addPointageForm.patchValue({
      project: pointage.project?.code || pointage.projet,
      employees: pointage.employees?.map((e: any) => e.id) || [],
      pointageDateRange: {
        start: pointage.pointageDateRange?.start || pointage.pointageDate,
        end: pointage.pointageDateRange?.end || pointage.pointageDate,
      },
      totalHours: pointage.totalHours,
      comment: pointage.comment,
    });
  }

  resolveEmployeeName(empId: number): string {
    const employee = this.employees.find((e) => e.id === empId);
    return employee ? `${employee.firstName} ${employee.lastName}` : '';
  }

  removeSelectedEmployee(empId: number) {
    const control = this.addPointageForm.get('employees');
    const current = control?.value as number[];
    control?.setValue(current.filter((id) => id !== empId));
  }

  cancel() {
    this.dialogRef.close(false);
  }

  submit() {
    if (this.addPointageForm.invalid) {
      this.addPointageForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const formValue = { ...this.addPointageForm.value };
    formValue.pointageDateRange = {
      start: formatDateToYMD(formValue.pointageDateRange.start),
      end: formatDateToYMD(formValue.pointageDateRange.end),
    };

    const entity: any = {
      ...formValue,
      project:
        this.projects.find((p) => p.code === formValue.project) || null,
      employees: this.employees.filter((e) =>
        formValue.employees.includes(e.id)
      ),
    };

    this.pointageService.create(entity, this.endpoint).subscribe({
      next: () => {
        this.snackBar.success('Pointage créé avec succès');
        this.submitting = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBar.error(err.error?.message || 'Erreur lors de la création du pointage');
        this.submitting = false;
      },
    });
  }

  listProjects() {
    this.projectService.list({}, 'projects').subscribe({
      next: (resp) => {
        this.projects = resp;
      },
      error: () => {
        this.snackBar.error('Erreur lors du chargement des projets');
      },
    });
  }

  listEmployees() {
    const project = this.addPointageForm.get('project')!.value;
    const params: any = { pageIndex: 0, pageSize: 10 };
    if (project) {
      params.project = project;
    }
    params.sort = { property: 'id', direction: 'ASC' };

    this.employeeService.list(params, 'employees').subscribe({
      next: (resp) => {
        this.employees = resp.content;
      },
      error: () => {
        this.snackBar.error('Erreur lors du chargement des employés');
      },
    });
  }

  disableFutureDates = (date: Date | null): boolean => {
    if (!date) return false;
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const t = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate()
    );
    return d <= t;
  };

  get dialogTitle(): string {
    switch (this.mode) {
      case 'visu': return 'Détails du pointage';
      case 'edit': return 'Modifier le pointage';
      default: return 'Créer un pointage';
    }
  }

  get dialogIcon(): string {
    switch (this.mode) {
      case 'visu': return 'visibility';
      case 'edit': return 'edit';
      default: return 'add_task';
    }
  }

  get isReadOnly(): boolean {
    return this.mode === 'visu';
  }
}
