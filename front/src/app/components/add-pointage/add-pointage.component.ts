import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  formatDateToYMD,
  formatToShortFormatDate,
  parseDate,
} from '../../utils/date-utils';
import { Project } from '../../models/projet';
import { Employe } from '../../models/employe';
import { ResourceService } from '../../services/resource.service';
import { Pointage } from '../../models/pointage';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-add-pointage',
  templateUrl: './add-pointage.component.html',
  styleUrl: './add-pointage.component.scss',
})
export class AddPointageComponent implements OnInit {
  readonly formatToShortFormatDate = formatToShortFormatDate;
  readonly parseDate = parseDate;
  readonly formatDateToYMD = formatDateToYMD;

  addPointageForm: FormGroup = new FormGroup({
    project: new FormControl(Validators.required),
    employees: new FormControl([], Validators.required),
    pointageDateRange: new FormGroup({
      start: new FormControl('', Validators.required),
      end: new FormControl('', Validators.required),
    }),
    totalHours: new FormControl(null, Validators.required),
    comment: new FormControl(''),
  });

  @Input()
  isReadOnly = false;

  conf: any = {
    libelles: {
      pointages: 'du pointage',
    },
    requests: {
      horaires: 'horaires',
      salaries: 'salaries',
    },
  };

  entity: any;
  today = new Date();

  projects: Project[] = [];
  employees: Employe[] = [];
  routesItem: string[] = ['horaires', 'salaries'];

  id: string = '';
  endpoint: string = '';
  project: string = '';
  entityName: string = '';

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private pointageService: ResourceService<Pointage>,
    private employeeService: ResourceService<Employe>,
    private projectService: ResourceService<Project>,
    private snackBar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.entityName =
      this.routesItem.find((item) =>
        this.route.snapshot.url.map((u) => u.path).includes(item)
      ) || '';

    this.endpoint = 'pointages/' + this.conf.requests[this.entityName];

    this.listProjects();
    this.addPointageForm.get('project')!.valueChanges.subscribe(() => {
      this.listEmployees();
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

  displayHeaderTitle() {
    return this.conf.libelles[this.entityName];
  }

  manageBack() {
    this.router.lastSuccessfulNavigation?.previousNavigation
      ? this.location.back()
      : this.router.navigate(['/pointages/' + this.entityName]);
  }

  validate() {
    if (this.addPointageForm.invalid) {
      this.addPointageForm.markAllAsTouched();
      return;
    }

    // Format start and end dates before sending
    const formValue = { ...this.addPointageForm.value };
    formValue.pointageDateRange = {
      start: formatDateToYMD(formValue.pointageDateRange.start),
      end: formatDateToYMD(formValue.pointageDateRange.end),
    };

    this.entity = {
      ...this.entity,
      ...formValue,
      project:
        this.projects.find((p) => p.code === formValue.project) ||
        this.entity.project,
      employees: this.employees.filter((e) =>
        formValue.employees.includes(e.id)
      ),
    };

    this.pointageService.create(this.entity, this.endpoint).subscribe({
      next: () => {
        this.snackBar.success('Pointage ajouté avec succès');
        this.manageBack();
      },
      error: (err) => {
        this.snackBar.error(err.error?.message || "Erreur lors de l'ajout du pointage");
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
    const params: any = {};

    params.pageIndex = 0;
    params.pageSize = 10;
    if (project) {
      params.project = project;
    }
    if (!params.sort) {
      params.sort = { property: 'id', direction: 'ASC' };
    }

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
    // Remove time part for comparison
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const t = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate()
    );
    return d <= t;
  };
}
