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
