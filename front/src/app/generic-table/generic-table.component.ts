import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
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
export class GenericTableComponent implements AfterViewInit, OnChanges {
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
  exportable = false;
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
  @Input()
  filterForm: any;
  @Input()
  exporting = false;
  @Input()
  typeContrat: string = '';
  @Input()
  canDisplay: boolean = true;
  @Input()
  canDisplayList: boolean = true;
  @Output()
  addClicked = new EventEmitter<any>();
  @Output()
  exportClicked = new EventEmitter<any>();
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
  @Output()
  checkBox = new EventEmitter<any>();
  @Output()
  allCheckBox = new EventEmitter<any>();
  @Output()
  showChart = new EventEmitter<any>();
  @Output() selectionChanged = new EventEmitter<number[]>();

  selectAllChecked: boolean = false;
  selectedItems: Set<number> = new Set();
  searchedValue = '';
  active = true;
  clickedRow: any;
  showPagination = true;
  loading = false;
  showChartClicked = false;

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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.nbActions = [this.isEditable, this.hasDetails].filter((v) => v).length;
    if (this.isEditable || this.hasDetails) this.columnsPath.push('actions');
    if (this.deletable) this.columnsPath.push('delete');
    this.selectedItems = new Set();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.clearSelection();
    }
  }

  clearSelection() {
    this.selectedItems.clear();
    this.selectAllChecked = false;
    this.emitSelectionChange();
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

  onSelectAllCheckbox(event: any) {
    this.selectAllChecked = event.checked;
    this.selectedItems.clear();

    if (this.selectAllChecked) {
      this.dataSource.data.forEach((element) =>
        this.selectedItems.add(element.id)
      );
    }

    this.emitSelectionChange();
  }

  onCheckboxChange(event: any, itemId: number) {
    const isChecked = event.checked;

    if (isChecked) {
      this.selectedItems.add(itemId);
    } else {
      this.selectedItems.delete(itemId);
      this.selectAllChecked = false;
    }

    this.selectAllChecked = this.dataSource.data.every((el) =>
      this.selectedItems.has(el.id)
    );

    this.emitSelectionChange();
  }

  emitSelectionChange() {
    this.selectionChanged.emit(Array.from(this.selectedItems));
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
    if (this.clickedRow?.id === row.id) {
      this.showChartClicked = !this.showChartClicked;
    }
    this.clickedRow = row;

    this.showChart.emit({ row: row, clicked: this.showChartClicked });
  }

  filter_clicked() {
    this.filterClicked.emit({
      size: this.pageSize,
      page: this.currentPage,
      libelle: this.searchedValue,
    });
  }

  export_clicked() {
    this.exportClicked.emit();
  }
}
