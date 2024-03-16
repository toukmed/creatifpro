/* import { Component, Input, OnInit } from '@angular/core';
import { JourPointage } from '../../models/jourPointage';
import { Field } from '../edit-page.component';
import { FormGroup } from '@angular/forms';
import { filter } from 'rxjs';
import { pointageEditFields } from '../../models/pointage';
import { detailcolumns } from '../../components/pointage/pointage.variables';

@Component({
  selector: 'app-edit-pointage',
  templateUrl: './edit-pointage.component.html',
  styleUrl: './edit-pointage.component.scss',
})
export class EditPointageComponent {
  @Input()
  formGroup: FormGroup;
  @Input()
  pointages: JourPointage[] = [];
  @Input()
  isAddition = false;
  headerRowDisplayNames: string[] = [];
  headerRowNames: string[] = [];
  detailcolumns = detailcolumns;

  add() {}
  searchPointages(event: any) {}
  edit(event: any, readOnly: boolean) {}

  dataSource: JourPointage[] = [
    {
      id: 1,
      jourPointage: '01/01/2024',
      pointage: 1,
      pointageSupplementaire: 0.125,
      projet: { id: 1, nom: 'HALASSA1', reference: 'REF_HALLASA1' },
    },
    {
      id: 2,
      jourPointage: '02/01/2024',
      pointage: 0.75,
      pointageSupplementaire: 0.25,
      projet: { id: 2, nom: 'HALASSA2', reference: 'REF_HALLASA2' },
    },
    {
      id: 3,
      jourPointage: '03/01/2024',
      pointage: 0.25,
      pointageSupplementaire: 0.125,
      projet: { id: 3, nom: 'HALASSA3', reference: 'REF_HALLASA3' },
    },
    {
      id: 4,
      jourPointage: '04/01/2024',
      pointage: 0.125,
      pointageSupplementaire: 0.25,
      projet: { id: 4, nom: 'HALASSA4', reference: 'REF_HALLASA4' },
    },
    {
      id: 5,
      jourPointage: '05/01/2024',
      pointage: 0.825,
      pointageSupplementaire: 0.125,
      projet: { id: 5, nom: 'HALASSA5', reference: 'REF_HALLASA5' },
    },
    {
      id: 6,
      jourPointage: '06/01/2024',
      pointage: 0,
      pointageSupplementaire: 0,
      projet: null,
    },
    {
      id: 5,
      jourPointage: '07/01/2024',
      pointage: 0,
      pointageSupplementaire: 0,
      projet: null,
    },
  ];
}
 */
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { JourPointage } from '../../models/jourPointage';
import {
  CalendarDayViewBeforeRenderEvent,
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { Subject } from 'rxjs';
import {
  addDays,
  addHours,
  endOfMonth,
  isSameDay,
  isSameMonth,
  startOfDay,
  subDays,
} from 'date-fns';
import { EventColor } from 'calendar-utils';
import { MatTableDataSource } from '@angular/material/table';

export const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-pointage',
  templateUrl: './edit-pointage.component.html',
  styleUrl: './edit-pointage.component.scss',
})
export class EditPointageComponent {
  @Input()
  pointages: JourPointage[] = [];
  @Input()
  isAddition = false;
  clickedColumn: number;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  events: CalendarEvent[] = [
    {
      start: new Date(2024, 2, 25),
      end: new Date(2024, 2, 25),
      title: 'A 1 day event',
      color: { ...colors['yellow'] },
      allDay: true,
    },
  ];

  refresh = new Subject<void>();

  activeDayIsOpen: boolean = true;

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  constructor() {}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log(this.viewDate);
    console.log('day clicked');
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
