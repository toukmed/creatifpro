import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

interface ColumnDef {
  libelle: string;
  path: string;
}

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss',
})
export class GenericTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnsAll: ColumnDef[];
  columnsPath: string[];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  total = 0;
  currentPage = 0;
  pageSize = 10;
  nbActions: number;
  @Input()
  addable = false;
  @Input()
  enabled = false;
  @Input()
  searchable = false;
  @Input()
  isEditable = false;
  @Input()
  hasDetails = false;
  @Input()
  clickableRow = false;
  @Input()
  deletable = false;
  @Input()
  entity = '';
  @Output()
  addClicked = new EventEmitter<any>();
  @Output()
  searched = new EventEmitter<any>();
  @Output()
  pageChanged = new EventEmitter<any>();
  @Output()
  edit = new EventEmitter<any>();
  @Output()
  showDetails = new EventEmitter<any>();
  @Output()
  openHistory = new EventEmitter<any>();
  @Output()
  removed = new EventEmitter<any>();
  @Output()
  filterClicked = new EventEmitter<any>();

  searchedValue = '';
  active = true;
  clickedRow: any;
  showPagination = true;
  loading = false;

  constructor(private router: Router) {}

  @Input() set columns(columns: ColumnDef[]) {
    this.columnsAll = columns;
    this.columnsPath = columns.map((c) => c.path);
  }

  @Input() set data(data: any) {
    if (!data) return;
    this.showPagination = !!data.content;
    this.dataSource.data = data.content ? data.content : data;
    this.currentPage = data.number;
    this.total = data.total;
    this.loading = false;
  }

  @Input() set showPlaceholder(value: boolean) {
    if (value) {
      this.loading = true;
      this.dataSource.data = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.nbActions = [this.isEditable, this.hasDetails].filter((v) => v).length;
    if (this.isEditable || this.hasDetails) this.columnsPath.push('actions');
    if (this.deletable) this.columnsPath.push('delete');
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

  add_clicked() {
    this.addClicked.emit();
  }

  input_searched(value: any) {
    this.currentPage = 0;
    this.searched.emit({
      size: this.pageSize,
      page: this.currentPage,
      libelle: value.target.value,
    });
  }

  page_changed(event: any) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.pageChanged.emit({
      size: this.pageSize,
      page: this.currentPage,
      libelle: this.searchedValue,
    });
  }

  edit_clicked(row: any) {
    this.edit.emit(row);
  }

  showDetails_clicked(row: any) {
    this.showDetails.emit(row);
  }

  remove_clicked(row: any) {
    this.removed.emit(row);
  }

  row_clicked(row: any) {
    this.clickedRow = row;
    this.showDetails.emit(row);
  }

  filter_clicked() {
    this.filterClicked.emit({
      size: this.pageSize,
      page: this.currentPage,
      libelle: this.searchedValue,
    });
  }
}
