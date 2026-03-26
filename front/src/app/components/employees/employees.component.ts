import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../models/projet';
import { Pointage } from '../../models/pointage';
import { ResourceService } from '../../services/resource.service';
import {
  formatDateToDashedString,
  formatDateToString,
  getStartOfMonth,
} from '../../utils/date-utils';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { columns } from './employees.variables';
import { MatDialog } from '@angular/material/dialog';
import { AddPointageDialogComponent } from '../add-pointage-dialog/add-pointage-dialog.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { CalendarPointageDialogComponent } from '../calendar-pointage-dialog/calendar-pointage-dialog.component';

const monthStart = getStartOfMonth(new Date());

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
  
    readonly filterForm = new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
      project: new FormControl<string>(''),
      label: new FormControl<string>(''),
    });
  
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
  
    constructor(
      private service: ResourceService<Pointage>,
      private projectService: ResourceService<Project>,
      private router: Router,
      private route: ActivatedRoute,
      private dialog: MatDialog
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
      });
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
      // Set start to first day of month, end to last day of month
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
      this.filterForm.patchValue({
        start,
        end,
      });
    }
  
    listProjects() {
      this.projectService.list({}, 'projects').subscribe((resp) => {
        this.projects = resp;
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
  
      this.service.list(params, this.endpoint).subscribe((resp) => {
        this.dataSource.data = resp.content;
        this.pointages = resp.content;
        this.currentPage = resp.number || params.pageIndex || 0;
        this.totalElements = resp.totalElements;
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
  
    add() {
      const dialogRef = this.dialog.open(AddPointageDialogComponent, {
        width: '580px',
        maxHeight: '90vh',
        panelClass: 'jira-dialog-panel',
        autoFocus: false,
        data: { entityName: this.activeRoute },
      });
  
      dialogRef.afterClosed().subscribe((created) => {
        if (created) {
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
          this.service.delete(event.id, this.endpoint).subscribe(() => {
            this.listPointage({
              pageIndex: this.paginator.pageIndex,
              pageSize: this.paginator.pageSize,
            });
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
