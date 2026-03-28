import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../models/projet';
import { Pointage } from '../../models/pointage';
import { Employe } from '../../models/employe';
import { ResourceService } from '../../services/resource.service';
import {
  formatDateToYMD,
  getStartOfMonth,
} from '../../utils/date-utils';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { columns } from './pointage.variables';
import { MatDialog } from '@angular/material/dialog';
import { CalendarPointageDialogComponent } from '../calendar-pointage-dialog/calendar-pointage-dialog.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { PointageRecapDialogComponent, PointageRecapData } from '../pointage-recap-dialog/pointage-recap-dialog.component';
import { SnackBarService } from '../../services/snack-bar.service';
import { HttpClient } from '@angular/common/http';

const monthStart = getStartOfMonth(new Date());

@Component({
  selector: 'app-list-pointage',
  templateUrl: './list-pointage.component.html',
  styleUrl: './list-pointage.component.scss',
})
export class ListPointageComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // ── Filter form ──
  readonly filterForm = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    project: new FormControl<string>(''),
    label: new FormControl<string>(''),
  });

  // ── Inline create form ──
  addPointageForm: FormGroup = new FormGroup({
    project: new FormControl(null, Validators.required),
    employees: new FormControl([], Validators.required),
    pointageDateRange: new FormGroup({
      start: new FormControl('', Validators.required),
      end: new FormControl('', Validators.required),
    }),
    workedDays: new FormControl(null, Validators.required),
    comment: new FormControl(''),
    isPaid: new FormControl(false),
  });

  showForm = false;
  submitting = false;
  formProjects: Project[] = [];
  formEmployees: Employe[] = [];
  existingDates: Set<string> = new Set();
  today = new Date();

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  readonly endpoint: string = 'pointages';
  readonly routesItem = ['horaires', 'salaries'];
  columnsAll = columns;
  columnsPath: string[] = [...columns.map((c) => c.path), 'actions'];

  //BOOLEANS
  selectAllChecked: boolean = false;
  active = true;
  showPagination = true;
  loading = false;
  showChartClicked = false;
  exporting = false;

  //STRINGS
  activeRoute: string = '';
  project: string = '';
  label: string = '';
  searchedValue = '';
  employeName: string = '';

  //DATES
  startDate: Date = monthStart;
  endDate: Date = new Date();
  currentMonth: Date = new Date();

  //LISTS
  selectedItems: Set<number> = new Set();
  pointages: Pointage[];
  projects: Project[] = [];

  //NUMBERS
  currentPage = 0;
  totalElements = 100;

  clickedRow: any;

  // ── Dashboard Stats ──
  dashboardOpen = false;
  statsLoading = false;
  stats = {
    totalPointages: 0,
    totalDays: 0,
    avgDaysPerEmployee: 0,
    totalPaid: 0,
    totalUnpaid: 0,
    paidPercentage: 0,
    uniqueEmployees: 0,
    uniqueProjects: 0,
    totalCost: 0,
    topEmployees: [] as { name: string; days: number; pointages: number }[],
    projectBreakdown: [] as { code: string; days: number; pointages: number; percentage: number }[],
    daysWithPointage: 0,
    daysWithoutPointage: 0,
    jobRoleBreakdown: [] as { role: string; count: number; days: number }[],
  };

  constructor(
    private service: ResourceService<Pointage>,
    private projectService: ResourceService<Project>,
    private employeeService: ResourceService<Employe>,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: SnackBarService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.activeRoute =
      this.routesItem.find((item) =>
        this.route.snapshot.url.map((u) => u.path).includes(item)
      ) || '';

    const params: any = {};
    params.startDate = this.startDate;
    params.endDate = this.endDate;

    this.listProjects();
    this.listPointage(params);
    this.loadStats();

    this.filterForm.valueChanges.subscribe((formValues) => {
      const params: any = {};

      this.project = formValues.project;
      this.label = formValues.label;
      this.startDate = formValues.start || monthStart;
      this.endDate = formValues.end || new Date();

      if (formValues.project) {
        params.project = this.project;
      }
      params.startDate = this.startDate;
      params.endDate = this.endDate;
      params.label = this.label;
      params.pageIndex = 0;
      params.pageSize = 10;

      this.listPointage(params);
      this.loadStats();
    });

    // When project changes in the create form, reload employees
    this.addPointageForm.get('project')!.valueChanges.subscribe(() => {
      this.loadFormEmployees();
    });

    // When employees selection changes, load existing pointage dates
    this.addPointageForm.get('employees')!.valueChanges.subscribe(() => {
      this.loadExistingDates();
    });

    // When date range changes, update the list of existing dates within the range
    this.addPointageForm.get('pointageDateRange')!.valueChanges.subscribe(() => {
      this.updateExistingDatesInRange();
    });
  }

  // ── Inline Form Methods ──

  prefillRow: Pointage | null = null;

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.addPointageForm.reset();
      this.addPointageForm.get('employees')?.setValue([]);
      this.existingDates = new Set();
      this.existingDatesInRange = [];
      this.prefillRow = null;
    } else {
      this.loadFormProjects();
    }
  }

  addDaysForRow(row: Pointage): void {
    // If form is already open with same prefill, just close it
    if (this.showForm && this.prefillRow?.id === row.id) {
      this.toggleForm();
      return;
    }

    // Close and reset first if open
    if (this.showForm) {
      this.addPointageForm.reset();
      this.addPointageForm.get('employees')?.setValue([]);
      this.existingDates = new Set();
      this.existingDatesInRange = [];
    }

    this.prefillRow = row;
    this.showForm = true;
    this.loadFormProjects();

    // Pre-fill project
    this.addPointageForm.get('project')?.setValue(row.project?.code || null);

    // Load employees for that project, then pre-select the employee
    const params: any = { pageIndex: 0, pageSize: 50 };
    if (row.project?.code) {
      params.project = row.project.code;
    }
    params.sort = { property: 'id', direction: 'ASC' };

    this.employeeService.list(params, 'employees').subscribe({
      next: (resp) => {
        this.formEmployees = resp.content;
        // Pre-select the employee from the row
        if (row.employee?.id) {
          this.addPointageForm.get('employees')?.setValue([row.employee.id]);
        }
      },
      error: () => {
        this.snackBar.error('Erreur lors du chargement des employés');
      },
    });
  }

  loadFormProjects(): void {
    this.projectService.list({}, 'projects').subscribe({
      next: (resp) => {
        this.formProjects = resp;
      },
      error: () => {
        this.snackBar.error('Erreur lors du chargement des projets');
      },
    });
  }

  loadFormEmployees(): void {
    const project = this.addPointageForm.get('project')!.value;
    const params: any = { pageIndex: 0, pageSize: 50 };
    if (project) {
      params.project = project;
    }
    params.sort = { property: 'id', direction: 'ASC' };

    this.employeeService.list(params, 'employees').subscribe({
      next: (resp) => {
        this.formEmployees = resp.content;
      },
      error: () => {
        this.snackBar.error('Erreur lors du chargement des employés');
      },
    });
  }

  resolveEmployeeName(empId: number): string {
    const employee = this.formEmployees.find((e) => e.id === empId);
    return employee ? `${employee.firstName} ${employee.lastName}` : '';
  }

  removeSelectedEmployee(empId: number): void {
    const control = this.addPointageForm.get('employees');
    const current = control?.value as number[];
    control?.setValue(current.filter((id) => id !== empId));
  }

  disableFutureDates = (date: Date | null): boolean => {
    if (!date) return false;
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const t = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
    return d <= t;
  };

  existingDatesInRange: string[] = [];

  loadExistingDates(): void {
    const employeeIds: number[] = this.addPointageForm.get('employees')?.value || [];
    if (!employeeIds.length) {
      this.existingDates = new Set();
      this.existingDatesInRange = [];
      return;
    }
    // Query 1 year back to cover all navigable months in the date picker
    const end = new Date();
    const start = new Date(end.getFullYear() - 1, end.getMonth(), 1);
    const body = {
      employeeIds,
      start: formatDateToYMD(start),
      end: formatDateToYMD(end),
    };
    this.http.post<any[]>('/api/pointages/existing-dates', body).subscribe({
      next: (dates) => {
        this.existingDates = new Set(dates.map((d) => this.normalizeDate(d)));
        this.updateExistingDatesInRange();
      },
      error: () => {
        this.existingDates = new Set();
        this.existingDatesInRange = [];
      },
    });
  }

  /**
   * Normalize a date that may come as [year, month, day] array or "yyyy-MM-dd" string
   * into a consistent "yyyy-MM-dd" string.
   */
  private normalizeDate(d: any): string {
    if (Array.isArray(d)) {
      const [y, m, day] = d;
      return `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    return String(d);
  }

  formatDateDisplay(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
    const day = date.getDate();
    const month = date.toLocaleDateString('fr-FR', { month: 'short' });
    return `${dayName} ${day} ${month}`;
  }

  updateExistingDatesInRange(): void {
    const rangeGroup = this.addPointageForm.get('pointageDateRange');
    const startVal = rangeGroup?.get('start')?.value;
    const endVal = rangeGroup?.get('end')?.value;
    if (!startVal || !endVal || this.existingDates.size === 0) {
      this.existingDatesInRange = [];
      return;
    }
    const s = new Date(startVal.getFullYear(), startVal.getMonth(), startVal.getDate());
    const e = new Date(endVal.getFullYear(), endVal.getMonth(), endVal.getDate());
    const matches: string[] = [];
    for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      const key = formatDateToYMD(d);
      if (this.existingDates.has(key)) {
        matches.push(key);
      }
    }
    this.existingDatesInRange = matches;
  }

  submitPointage(): void {
    if (this.addPointageForm.invalid) {
      this.addPointageForm.markAllAsTouched();
      return;
    }

    const formValue = { ...this.addPointageForm.value };
    const startDate: Date = formValue.pointageDateRange.start;
    const endDate: Date = formValue.pointageDateRange.end;

    // Compute all days in range
    const allDays: string[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      allDays.push(formatDateToYMD(new Date(d)));
    }

    const selectedProject = this.formProjects.find((p) => p.code === formValue.project);
    const selectedEmployees = this.formEmployees.filter((e) => formValue.employees.includes(e.id));

    const recapData: PointageRecapData = {
      projectCode: selectedProject?.code || '',
      projectReference: (selectedProject as any)?.reference || '',
      employees: selectedEmployees.map((e) => ({ id: e.id, firstName: e.firstName, lastName: e.lastName })),
      allDays,
      employeeIds: selectedEmployees.map((e) => e.id),
      workedDays: formValue.workedDays,
      comment: formValue.comment || '',
      isPaid: formValue.isPaid || false,
    };

    const dialogRef = this.dialog.open(PointageRecapDialogComponent, {
      width: '580px',
      maxHeight: '90vh',
      panelClass: 'recap-dialog-panel',
      autoFocus: false,
      data: recapData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.confirmed && result.newDays?.length) {
        this.doSubmitPointage(formValue, selectedProject, selectedEmployees, result.newDays);
      }
    });
  }

  private doSubmitPointage(formValue: any, selectedProject: any, selectedEmployees: Employe[], newDays: string[]): void {
    this.submitting = true;

    // Send only the actual new days range to the backend
    const sortedDays = [...newDays].sort();
    const entity: any = {
      ...formValue,
      pointageDateRange: {
        start: sortedDays[0],
        end: sortedDays[sortedDays.length - 1],
      },
      project: selectedProject || null,
      employees: selectedEmployees,
    };

    const fullEndpoint = 'pointages' + this.activeRoute;
    this.service.create(entity, fullEndpoint).subscribe({
      next: () => {
        this.snackBar.success('Pointage créé avec succès');
        this.submitting = false;
        this.addPointageForm.reset();
        this.addPointageForm.get('employees')?.setValue([]);
        this.existingDates = new Set();
        this.existingDatesInRange = [];
        this.prefillRow = null;
        this.showForm = false;
        this.listPointage({
          pageIndex: this.paginator?.pageIndex || 0,
          pageSize: this.paginator?.pageSize || 10,
          startDate: this.startDate,
          endDate: this.endDate,
        });
        this.loadStats();
      },
      error: (err) => {
        this.snackBar.error(err.error?.message || 'Erreur lors de la création du pointage');
        this.submitting = false;
      },
    });
  }

  // ── Existing Methods ──

  loadStats(): void {
    this.statsLoading = true;
    const params: any = {
      startDate: this.startDate,
      endDate: this.endDate,
      pageIndex: 0,
      pageSize: 1000,
      sort: { property: 'id', direction: 'ASC' },
    };
    if (this.project && this.project !== '') {
      params.project = this.project;
    }
    if (this.label && this.label !== '') {
      params.label = this.label;
    }
    this.service.list(params, this.endpoint).subscribe({
      next: (resp) => {
        this.computeStats(resp.content || []);
        this.statsLoading = false;
      },
      error: () => {
        this.statsLoading = false;
      },
    });
  }

  computeStats(data: any[]): void {
    const totalPointages = data.length;
    const totalDays = data.reduce((sum, p) => sum + (p.workedDays || 0), 0);
    const pointedDays = data.filter((p) => p.workedDays > 0).length;
    const avgDaysPerEmployee = pointedDays > 0 ? totalDays / pointedDays : 0;
    const totalPaid = data.filter((p) => p.isPaid).length;
    const totalUnpaid = totalPointages - totalPaid;
    const paidPercentage = totalPointages > 0 ? (totalPaid / totalPointages) * 100 : 0;

    const employeeMap = new Map<number, { name: string; days: number; pointages: number; dailyRate: number; role: string }>();
    data.forEach((p) => {
      if (p.employee) {
        const id = p.employee.id;
        if (!employeeMap.has(id)) {
          employeeMap.set(id, {
            name: `${p.employee.firstName} ${p.employee.lastName}`,
            days: 0,
            pointages: 0,
            dailyRate: p.employee.dailyRate || 0,
            role: p.employee.jobRole || 'Non défini',
          });
        }
        const entry = employeeMap.get(id)!;
        entry.days += p.workedDays || 0;
        entry.pointages += 1;
      }
    });

    const projectMap = new Map<string, { code: string; days: number; pointages: number }>();
    data.forEach((p) => {
      if (p.project) {
        const code = p.project.code;
        if (!projectMap.has(code)) {
          projectMap.set(code, { code, days: 0, pointages: 0 });
        }
        const entry = projectMap.get(code)!;
        entry.days += p.workedDays || 0;
        entry.pointages += 1;
      }
    });

    const topEmployees = Array.from(employeeMap.values())
      .sort((a, b) => b.days - a.days)
      .slice(0, 5);

    const projectBreakdown = Array.from(projectMap.values())
      .sort((a, b) => b.days - a.days)
      .map((proj) => ({
        ...proj,
        percentage: totalDays > 0 ? (proj.days / totalDays) * 100 : 0,
      }));

    const totalCost = Array.from(employeeMap.values()).reduce(
      (sum, emp) => sum + emp.days * emp.dailyRate, 0
    );

    const daysWithPointage = pointedDays;
    const daysWithoutPointage = totalPointages - pointedDays;

    const roleMap = new Map<string, { role: string; count: number; days: number }>();
    employeeMap.forEach((emp) => {
      if (!roleMap.has(emp.role)) {
        roleMap.set(emp.role, { role: emp.role, count: 0, days: 0 });
      }
      const entry = roleMap.get(emp.role)!;
      entry.count += 1;
      entry.days += emp.days;
    });
    const jobRoleBreakdown = Array.from(roleMap.values()).sort((a, b) => b.days - a.days);

    this.stats = {
      totalPointages,
      totalDays,
      avgDaysPerEmployee: Math.round(avgDaysPerEmployee * 10) / 10,
      totalPaid,
      totalUnpaid,
      paidPercentage: Math.round(paidPercentage),
      uniqueEmployees: employeeMap.size,
      uniqueProjects: projectMap.size,
      totalCost,
      topEmployees,
      projectBreakdown,
      daysWithPointage,
      daysWithoutPointage,
      jobRoleBreakdown,
    };
  }

  toggleDashboard(): void {
    this.dashboardOpen = !this.dashboardOpen;
  }

  previousMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
    this.updateMonthFilter();
  }

  nextMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
    this.updateMonthFilter();
  }

  updateMonthFilter() {
    const start = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth(),
      1
    );
    const end = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      0
    );
    this.filterForm.patchValue({ start, end });
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

  listPointage(params: any = {}) {
    if (!params.sort) {
      params.sort = { property: 'id', direction: 'ASC' };
    }
    if (!params.pageIndex) {
      params.pageIndex = 0;
    }
    if (!params.pageSize) {
      params.pageSize = 10;
    }

    this.service.list(params, this.endpoint).subscribe({
      next: (resp) => {
        this.dataSource.data = resp.content;
        this.pointages = resp.content;
        this.currentPage = resp.number || params.pageIndex || 0;
        this.totalElements = resp.totalElements;
      },
      error: () => {
        this.snackBar.error('Erreur lors du chargement des pointages');
      },
    });
  }

  edit(configuration: any, details: boolean) {
    const dialogRef = this.dialog.open(CalendarPointageDialogComponent, {
      width: '90vw',
      height: '90vh',
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'calendar-dialog-panel',
      autoFocus: false,
      data: {
        entityName: this.activeRoute,
        row: configuration,
        currentMonth: this.currentMonth,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listPointage({
          pageIndex: this.paginator?.pageIndex || 0,
          pageSize: this.paginator?.pageSize || 10,
          startDate: this.startDate,
          endDate: this.endDate,
        });
      }
    });
  }

  remove(event: Pointage) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: 'Êtes-vous sûr de vouloir supprimer ce pointage ?',
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.service.delete(event.id, this.endpoint).subscribe({
          next: () => {
            this.snackBar.success('Pointage supprimé avec succès');
            this.listPointage({
              pageIndex: this.paginator.pageIndex,
              pageSize: this.paginator.pageSize,
            });
          },
          error: (err) => {
            this.snackBar.error(err.error?.message || 'Erreur lors de la suppression du pointage');
          },
        });
      }
    });
  }

  page_changed(event: PageEvent) {
    const params: any = {
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
      sort: { property: 'id', direction: 'ASC' },
      startDate: this.startDate,
      endDate: this.endDate,
      label: this.label,
    };
    if (this.project && this.project !== '') {
      params.project = this.project;
    }

    this.listPointage(params);
  }

  trackBy(index: number, el: any) {
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
