import { Component, OnInit } from '@angular/core';
import { columns } from './pointage.variables';
import { ResourceService } from '../../services/resource.service';
import { Pointage } from '../../models/pointage';
import { Router } from '@angular/router';
import {
  getEndOfWeek,
  getEndOfWeekDate,
  getStartOfWeek,
  getStartOfWeekDate,
} from '../../utils/utils';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddPointageComponent } from './details/add-pointage/add-pointage.component';
import { Projet } from '../../models/projet';
import { FormControl, FormGroup } from '@angular/forms';
import { config } from 'rxjs';

const weekStart = getStartOfWeek(new Date());
const weekEnd = getEndOfWeek(new Date());

@Component({
  selector: 'app-pointage',
  templateUrl: './pointage.component.html',
  styleUrl: './pointage.component.scss',
})
export class PointageComponent implements OnInit {
  readonly currentWeekNavigated: Date = new Date();
  readonly rangeDate = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  readonly columns = columns;

  pointages: Pointage[];
  projects: any;

  constructor(
    private service: ResourceService<Pointage>,
    private projectService: ResourceService<Projet>,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initDateRangeForm(this.currentWeekNavigated);
    this.listPointage(weekStart, weekEnd);
  }

  initDateRangeForm(date: Date) {
    this.rangeDate.controls['start'].setValue(getStartOfWeekDate(date));
    this.rangeDate.controls['end'].setValue(getEndOfWeekDate(date));
  }

  listPointage(weekStart: any, weekEnd: any) {
    this.service
      .list(
        {
          libelle: '',
          startDate: weekStart,
          endDate: weekEnd,
          size: 10000,
        },
        'pointages'
      )
      .subscribe((resp) => {
        this.pointages = resp.content;
      });
  }

  searchPointages(args: any) {
    this.service
      .list(
        {
          ...args,
          weekStartDate: weekStart,
          weekEndDate: weekEnd,
          size: 10000,
        },
        'pointages'
      )
      .subscribe((resp) => {
        this.pointages = resp.content;
      });
  }

  edit(configuration: any, details: boolean) {
    let array = ['pointages', configuration.id];
    if (details) array.push('visu');
    this.router.navigate(array);
  }

  add() {
    const dialogConfig = new MatDialogConfig();
    //dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '1000px';
    dialogConfig.height = '650px';

    this.projectService.list({ libelle: '' }, 'projets').subscribe((resp) => {
      dialogConfig.data = { projects: resp.content };

      this.dialog.open(AddPointageComponent, dialogConfig);
    });
  }

  nextWeek() {
    this.currentWeekNavigated.setDate(this.currentWeekNavigated.getDate() + 7);
    this.initDateRangeForm(this.currentWeekNavigated);
    this.setDateNavigationAndListPointage(this.currentWeekNavigated);
  }
  previousWeek() {
    this.currentWeekNavigated.setDate(this.currentWeekNavigated.getDate() - 7);
    this.initDateRangeForm(this.currentWeekNavigated);
    this.setDateNavigationAndListPointage(this.currentWeekNavigated);
  }

  private setDateNavigationAndListPointage(navigationWeek: Date) {
    const weekStart = getStartOfWeek(navigationWeek);
    const weekEnd = getEndOfWeek(navigationWeek);
    this.listPointage(weekStart, weekEnd);
  }
}
