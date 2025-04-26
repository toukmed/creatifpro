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
} from '../../../../utils/date-utils';
import { MatDialog } from '@angular/material/dialog';
import { AddSinglePointageComponent } from '../add-single-pointage/add-single-pointage.component';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { isSameDay } from 'date-fns';
import { ResourceService } from '../../../../services/resource.service';
import { Employe } from '../../../../models/employe';
import { ActivatedRoute } from '@angular/router';
import { JourPointage } from '../../../../models/jourPointage';
import { ConfirmDialogComponent } from '../../../../confirm-dialog/confirm-dialog.component';
import { dialogConfig } from '../../../../utils/utils';
import { MatDatepicker } from '@angular/material/datepicker';
import { AddPointageComponent } from '../add-pointage/add-pointage.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  readonly formatMonthRange = formatMonthRange;
  readonly dialogConfig = dialogConfig;
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
  isCellUpdated = false;
  updatedDay: any;
  initials: string = '';
  employe: Employe;
  heuresTravailles: number;
  pourcentagePaye: any;
  displayAddBulkForm: boolean = false;

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
        this.heuresTravailles = this.pointages?.reduce((total, pointage) => {
          return total + pointage.pointage;
        }, 0);
        this.pourcentagePaye =
          this.pointages.length !== 0
            ? (
                (this.pointages?.filter((pointage) => pointage.status).length /
                  this.pointages?.length) *
                100
              ).toFixed(2)
            : 0;
      });
  }

  pointageClicked(day: any) {
    if (!this.isReadOnly) {
      this.jourPointageService
        .getById(this.entity.id, 'jourPointages', formatDateToString(day.date))
        .subscribe((resp) => {
          this.jourPointage = resp;
          this.openSingleDialog(day);
        });
    }
  }

  dayClicked(day: any) {
    if (!this.isReadOnly) {
      this.jourPointageService
        .getById(this.entity.id, 'jourPointages', formatDateToString(day.date))
        .subscribe((resp) => {
          if (resp === null) {
            this.jourPointage = resp;
            this.openSingleDialog(day);
          }
        });
    }
  }

  private openSingleDialog(day: any) {
    this.dialog
      .open(
        AddSinglePointageComponent,
        this.dialogConfig(
          {
            date: day?.date,
            entity: this.entity,
            jourPointage: this.jourPointage,
          },
          '400px',
          '400px'
        )
      )
      .afterClosed()
      .subscribe((resp) => {
        if (resp.status) {
          this.setUpdatedCell(resp);
          this.listJourPointages(
            formatDateToString(getStartOfMonth(this.viewDate)),
            formatDateToString(getEndOfMonth(this.viewDate))
          );
        }
      });
  }

  openBulkDialog() {
    this.dialog
      .open(
        AddPointageComponent,
        this.dialogConfig(
          {
            fromMainPage: false,
            entity: this.entity,
            typeContrat: this.entity?.employe?.typeContrat,
          },
          '500px',
          '500px'
        )
      )
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.setUpdatedCell(resp);
          this.listJourPointages(
            formatDateToString(getStartOfMonth(this.viewDate)),
            formatDateToString(getEndOfMonth(this.viewDate))
          );
        }
      });
  }

  private setUpdatedCell(resp: any) {
    this.updatedDay = resp.updatedDay;
    this.isCellUpdated = resp.isCellUpdated;
    setTimeout(() => {
      this.isCellUpdated = false;
    }, 3000);
  }

  deletePointage(day: any) {
    const dialogConfig = this.dialogConfig(
      `Toutes les informations du pointage du jour <b>${formatDateToString(
        day.date
      )} </b> seront supprimées, etes vous sur de vouloir continuer l'action.`,
      '650px',
      '250px'
    );

    this.dialog
      .open(ConfirmDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.deletePointageRequest(day);
          this.updatedDay = day.date;
          this.isCellUpdated = true;

          setTimeout(() => {
            this.isCellUpdated = false;
          }, 3000);
        }
      });
  }

  deletePointageRequest(day: any) {
    this.jourPointageService
      .delete(this.entity.id, 'jourPointages', formatDateToString(day.date))
      .subscribe(() => {
        this.listJourPointages(
          formatDateToString(getStartOfMonth(this.viewDate)),
          formatDateToString(getEndOfMonth(this.viewDate))
        );
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
    return filteredPointages.filter((pointage) =>
      isSameDay(parseDate(pointage.jourPointage), day.date)
    );
  }

  isSameDate(updatedDate, date): boolean {
    return isSameDay(updatedDate, date);
  }

  onMonthSelected(event: any) {
    this.viewDate = event.value;
  }

  // Choose month from date picker
  chosenMonthHandler(normalizedMonth: Date, datepicker: MatDatepicker<Date>) {
    const ctrlValue = this.viewDate;
    ctrlValue.setMonth(normalizedMonth.getMonth());
    this.viewDate = new Date(ctrlValue);
    datepicker.close();
  }
}
