import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  formatDateToString,
  formatMonthRange,
  getEndOfMonth,
  getNextMonth,
  getPreviousMonth,
  getStartOfMonth,
  parseDate,
} from '../../../../utils/utils';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddSinglePointageComponent } from '../add-single-pointage/add-single-pointage.component';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { addHours, isSameDay, parse, startOfDay } from 'date-fns';
import { ResourceService } from '../../../../services/resource.service';
import { Pointage } from '../../../../models/pointage';
import { Employe } from '../../../../models/employe';
import { ActivatedRoute } from '@angular/router';
import { JourPointage } from '../../../../models/jourPointage';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  readonly formatMonthRange = formatMonthRange;
  @Input()
  entity: any;
  @Input()
  entityName: string = '';
  @Input()
  isReadOnly = false;
  viewDate: Date;
  locale: string = 'fr';
  @ViewChild('calendarCell', { static: true }) calendarCell!: TemplateRef<any>;
  pointages: JourPointage[];
  events: CalendarEvent<{ pointage: JourPointage }>[] = [];
  jourPointage: JourPointage;

  constructor(
    private jourPointageService: ResourceService<JourPointage>,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.viewDate = new Date();
    this.listJourPointages(
      formatDateToString(getStartOfMonth(this.viewDate)),
      formatDateToString(getEndOfMonth(this.viewDate))
    );
  }

  listJourPointages(startDate: any, endDate: any) {
    const id = this.route.snapshot.paramMap.get('id');

    this.jourPointageService
      .list(
        {
          libelle: '',
          idPointage: id,
          startDate: startDate,
          endDate: endDate,
          size: 10000,
        },
        'jourPointages'
      )
      .subscribe((resp) => {
        this.pointages = resp;
      });
  }

  refreshCalendar() {
    this.listJourPointages(
      formatDateToString(getStartOfMonth(this.viewDate)),
      formatDateToString(getEndOfMonth(this.viewDate))
    );
  }

  previousMonth() {
    this.viewDate = getPreviousMonth(this.viewDate);
    this.listJourPointages(
      formatDateToString(getStartOfMonth(this.viewDate)),
      formatDateToString(getEndOfMonth(this.viewDate))
    );
  }
  nextMonth() {
    this.viewDate = getNextMonth(this.viewDate);
    this.listJourPointages(
      formatDateToString(getStartOfMonth(this.viewDate)),
      formatDateToString(getEndOfMonth(this.viewDate))
    );
  }

  dayClicked(day: any) {
    console.log('event::', event);
    if (!this.isReadOnly) {
      this.jourPointageService
        .getById(this.entity.id, 'jourPointages', formatDateToString(day.date))
        .subscribe((resp) => {
          this.jourPointage = resp;
          const dialogConfig = new MatDialogConfig();
          dialogConfig.autoFocus = true;
          dialogConfig.width = '450px';
          dialogConfig.height = '650px';
          dialogConfig.data = {
            date: day?.date,
            entity: this.entity,
            jourPointage: this.jourPointage,
          };
          this.dialog
            .open(AddSinglePointageComponent, dialogConfig)
            .afterClosed()
            .subscribe((res) => {
              this.listJourPointages(
                formatDateToString(getStartOfMonth(this.viewDate)),
                formatDateToString(getEndOfMonth(this.viewDate))
              );
            });
        });
    }
  }

  getPointageForDay(day: CalendarMonthViewDay): JourPointage[] {
    return this.pointages?.filter((pointage) => {
      const [pointageDay, pointageMonth, pointageYear] = pointage?.jourPointage
        ?.split('/')
        .map(Number);

      const pointageDate: Date = new Date(
        pointageYear,
        pointageMonth - 1,
        pointageDay
      );
      return isSameDay(day.date, pointageDate);
    });
  }

  cellContainPointage(day: any) {
    const filteredPointages = this.pointages;
    return filteredPointages.filter(
      (pointage) => !isSameDay(parseDate(pointage.jourPointage), day.date)
    );
  }
}
