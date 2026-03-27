import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
  selector: 'app-edit-pointage',
  templateUrl: './edit-pointage.component.html',
  styleUrl: './edit-pointage.component.scss',
})
export class EditPointageComponent implements OnInit {
  readonly formatToShortFormatDate = formatToShortFormatDate;
  readonly parseDate = parseDate;
  readonly formatDateToYMD = formatDateToYMD;

  @Input()
  isReadOnly = false;

  entity: any;
  today = new Date();
  id: string;
  projects: Project[] = [];
  employees: Employe[] = [];
  routesItem: string[] = ['horaires', 'salaries'];
  endpoint: string = '';
  project: string = '';

  addPointageForm: FormGroup = new FormGroup({
    project: new FormControl(),
    employee: new FormControl(Validators.required),
    pointageDate: new FormControl('', Validators.required),
    totalHours: new FormControl(),
    comment: new FormControl(''),
  });

  entityName: string = '';

  conf: any = {
    libelles: {
      pointages: 'du pointage',
    },
    requests: {
      horaires: 'horaires',
      salaries: 'salaries',
    },
  };

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
    this.setFormState();

    this.entityName =
      this.routesItem.find((item) =>
        this.route.snapshot.url.map((u) => u.path).includes(item)
      ) || '';

    this.endpoint = 'pointages/' + this.conf.requests[this.entityName];

    this.listProjects();
    this.addPointageForm.get('project')!.valueChanges.subscribe(() => {
      this.listEmployees();
    });

    this.id = this.route.snapshot.paramMap.get('id');
    this.getPointage();
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

    this.entity = {
      ...this.entity,
      ...this.addPointageForm.value,
      // If you need to send nested objects for project/employee:
      project:
        this.projects.find(
          (p) => p.code === this.addPointageForm.value.project
        ) || this.entity.project,
      employee:
        this.employees.find((e) =>
          this.addPointageForm.value.employee.includes(e.id)
        ) || this.entity.employee,
      pointageDate: parseDate(this.addPointageForm.value.pointageDate),
    };

    this.pointageService.update(this.entity, this.endpoint).subscribe({
      next: () => {
        this.snackBar.success('Pointage modifié avec succès');
        this.manageBack();
      },
      error: (err) => {
        this.snackBar.error(err.error?.message || 'Erreur lors de la modification du pointage');
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
    if (project) {
      params.project = project;
    }
    params.pageIndex = 0;
    params.pageSize = 10;
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

  getPointage() {
    this.pointageService
      .getById(parseInt(this.id ?? ''), this.endpoint)
      .subscribe({
        next: (res) => {
          this.entity = res;
          this.addPointageForm.patchValue({
            project: res.project.reference + ' - ' + res.project.code,
            employee: res.employee.firstName + ' ' + res.employee.lastName,
            pointageDate: res.pointageDate,
            totalHours: res.totalHours,
            comment: res.comment,
          });
        },
        error: () => {
          this.snackBar.error('Erreur lors du chargement du pointage');
        },
      });
  }

  private setFormState() {
    if (this.isReadOnly) {
      this.addPointageForm.disable({ emitEvent: false });
    } else {
      this.addPointageForm.enable({ emitEvent: false });
    }
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
}
