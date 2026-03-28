import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ResourceService } from '../../services/resource.service';
import { Pointage } from '../../models/pointage';
import { formatDateToYMD } from '../../utils/date-utils';
import { SnackBarService } from '../../services/snack-bar.service';

export interface CalendarDialogData {
  entityName: string;
  row: any;
  currentMonth: Date;
}

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isFuture: boolean;
  pointage: any | null;
  editing: boolean;
  editValue: number | null;
  editComment: string;
  editIsPaid: boolean;
}

@Component({
  selector: 'app-calendar-pointage-dialog',
  templateUrl: './calendar-pointage-dialog.component.html',
  styleUrls: ['./calendar-pointage-dialog.component.scss'],
})
export class CalendarPointageDialogComponent implements OnInit {
  weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  calendarWeeks: CalendarDay[][] = [];
  currentMonth: Date;
  employeeName: string;
  employeeId: number;
  projectCode: string;
  loading = false;
  saving = false;
  endpoint: string;
  row: any;

  constructor(
    private dialogRef: MatDialogRef<CalendarPointageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CalendarDialogData,
    private pointageService: ResourceService<Pointage>,
    private snackBar: SnackBarService
  ) {
    this.endpoint = 'pointages';
    this.row = data.row;
    this.currentMonth = data.currentMonth
      ? new Date(data.currentMonth.getFullYear(), data.currentMonth.getMonth(), 1)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.employeeName = `${data.row.employee.firstName || ''} ${data.row.employee.lastName || ''}`.trim();
    this.employeeId = data.row.employee.id;
    this.projectCode = data.row.projet || data.row.project?.code || '';
  }

  ngOnInit(): void {
    this.buildCalendar();
    this.loadEmployeePointages();
  }

  get monthLabel(): string {
    return this.currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  previousMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
    this.buildCalendar();
    this.loadEmployeePointages();
  }

  nextMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
    this.buildCalendar();
    this.loadEmployeePointages();
  }

  private buildCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();

    // Monday=0 ... Sunday=6
    let startDow = (firstDay.getDay() + 6) % 7;

    const days: CalendarDay[] = [];

    // Fill leading days from previous month
    for (let i = startDow - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push(this.createDay(d, false, today));
    }

    // Current month days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      days.push(this.createDay(date, true, today));
    }

    // Fill trailing days
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(year, month + 1, i);
        days.push(this.createDay(d, false, today));
      }
    }

    // Split into weeks
    this.calendarWeeks = [];
    for (let i = 0; i < days.length; i += 7) {
      this.calendarWeeks.push(days.slice(i, i + 7));
    }
  }

  private createDay(date: Date, isCurrentMonth: boolean, today: Date): CalendarDay {
    const dow = date.getDay();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return {
      date,
      dayNumber: date.getDate(),
      isCurrentMonth,
      isToday:
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear(),
      isWeekend: dow === 0 || dow === 6,
      isFuture: dateMidnight > todayMidnight,
      pointage: null,
      editing: false,
      editValue: null,
      editComment: '',
      editIsPaid: false,
    };
  }

  private loadEmployeePointages(): void {
    this.loading = true;
    const startDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const endDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);

    const body: any = {
      startDate,
      endDate,
      label: this.employeeName,
      sort: { property: 'pointageDate', direction: 'ASC' },
    };

    this.pointageService.listById(this.employeeId, 'pointages/employee', body).subscribe({
      next: (resp) => {
        const pointages = resp.content || resp;
        this.mapPointagesToCalendar(pointages);
        this.loading = false;
      },
      error: () => {
        this.snackBar.error('Erreur lors du chargement des pointages');
        this.loading = false;
      },
    });
  }

  private parseFrenchDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    // Handle French format like "sam. 07/03/2026" → extract dd/MM/yyyy
    const match = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const year = parseInt(match[3], 10);
      return new Date(year, month, day);
    }
    // Fallback to standard Date parsing
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  }

  private mapPointagesToCalendar(pointages: any[]): void {
    // Clear existing pointages
    for (const week of this.calendarWeeks) {
      for (const day of week) {
        day.pointage = null;
      }
    }

    for (const p of pointages) {
      if (!p.pointageDate) continue;
      const pDate = this.parseFrenchDate(p.pointageDate);
      if (!pDate) continue;
      for (const week of this.calendarWeeks) {
        for (const day of week) {
          if (
            day.date.getDate() === pDate.getDate() &&
            day.date.getMonth() === pDate.getMonth() &&
            day.date.getFullYear() === pDate.getFullYear()
          ) {
            day.pointage = p;
          }
        }
      }
    }
  }

  startEdit(day: CalendarDay): void {
    if (!day.isCurrentMonth) return;
    // Close any other editing
    for (const week of this.calendarWeeks) {
      for (const d of week) {
        d.editing = false;
      }
    }
    day.editing = true;
    day.editValue = day.pointage?.workedDays ?? null;
    day.editComment = day.pointage?.comment ?? '';
    day.editIsPaid = day.pointage?.isPaid ?? false;
  }

  cancelEdit(day: CalendarDay): void {
    day.editing = false;
  }

  saveEdit(day: CalendarDay): void {
    if (day.editValue === null || day.editValue === undefined) return;

    this.saving = true;

    if (day.pointage) {
      // Update existing
      const pDate = this.parseFrenchDate(day.pointage.pointageDate);
      const updated = {
        ...day.pointage,
        pointageDate: pDate ? formatDateToYMD(pDate) : day.pointage.pointageDate,
        workedDays: day.editValue,
        comment: day.editComment,
        isPaid: day.editIsPaid,
      };
      this.pointageService.update(updated, this.endpoint).subscribe({
        next: (resp: any) => {
          day.pointage = { ...day.pointage, ...resp, workedDays: day.editValue, comment: day.editComment, isPaid: day.editIsPaid };
          day.editing = false;
          this.saving = false;
          this.snackBar.success('Pointage mis à jour');
        },
        error: () => {
          this.snackBar.error('Erreur lors de la mise à jour du pointage');
          this.saving = false;
        },
      });
    } else {
      // Create new
      const entity: any = {
        project: this.row.project || { code: this.projectCode },
        employees: this.row.employee ? [this.row.employee] : [],
        pointageDateRange: {
          start: formatDateToYMD(day.date),
          end: formatDateToYMD(day.date),
        },
        workedDays: day.editValue,
        comment: day.editComment,
        isPaid: day.editIsPaid,
      };
      this.pointageService.create(entity, this.endpoint).subscribe({
        next: (created: any) => {
          const result = Array.isArray(created) ? created[0] : created;
          day.pointage = result
            ? { ...result, workedDays: day.editValue, comment: day.editComment, isPaid: day.editIsPaid }
            : { workedDays: day.editValue, comment: day.editComment, isPaid: day.editIsPaid, pointageDate: day.date };
          day.editing = false;
          this.saving = false;
          this.snackBar.success('Pointage créé');
        },
        error: () => {
          this.snackBar.error('Erreur lors de la création du pointage');
          this.saving = false;
        },
      });
    }
  }

  close(): void {
    this.dialogRef.close(true);
  }

  getTotalDaysForMonth(): number {
    let total = 0;
    for (const week of this.calendarWeeks) {
      for (const day of week) {
        if (day.isCurrentMonth && day.pointage?.workedDays) {
          total += day.pointage.workedDays;
        }
      }
    }
    return Math.round(total * 100) / 100;
  }

  getWorkedDaysCount(): number {
    let count = 0;
    for (const week of this.calendarWeeks) {
      for (const day of week) {
        if (day.isCurrentMonth && day.pointage?.workedDays > 0) {
          count++;
        }
      }
    }
    return count;
  }
}
