import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

export interface PointageRecapData {
  projectCode: string;
  projectReference: string;
  employees: { id: number; firstName: string; lastName: string }[];
  allDays: string[];
  employeeIds: number[];
  workedDays: number;
  comment: string;
  isPaid: boolean;
}

@Component({
  selector: 'app-pointage-recap-dialog',
  templateUrl: './pointage-recap-dialog.component.html',
  styleUrls: ['./pointage-recap-dialog.component.scss'],
})
export class PointageRecapDialogComponent implements OnInit {
  loading = true;
  newDays: string[] = [];
  skippedDays: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<PointageRecapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PointageRecapData,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchExistingAndCompute();
  }

  private fetchExistingAndCompute(): void {
    if (!this.data.allDays.length || !this.data.employeeIds.length) {
      this.newDays = [...this.data.allDays];
      this.skippedDays = [];
      this.loading = false;
      return;
    }

    const sortedDays = [...this.data.allDays].sort();
    const body = {
      employeeIds: this.data.employeeIds,
      start: sortedDays[0],
      end: sortedDays[sortedDays.length - 1],
    };

    this.http.post<any[]>('/api/pointages/existing-dates', body).subscribe({
      next: (existingDates) => {
        const normalized = existingDates.map((d) => this.normalizeDate(d));
        const existingSet = new Set(normalized);
        this.newDays = this.data.allDays.filter((d) => !existingSet.has(d));
        this.skippedDays = this.data.allDays.filter((d) => existingSet.has(d));
        this.loading = false;
      },
      error: () => {
        // On error, assume all days are new (backend will handle duplicates)
        this.newDays = [...this.data.allDays];
        this.skippedDays = [];
        this.loading = false;
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

  get totalPointages(): number {
    return this.newDays.length * this.data.employees.length;
  }

  get totalDaysAll(): number {
    return this.totalPointages * this.data.workedDays;
  }

  get hasNoDaysToCreate(): boolean {
    return !this.loading && this.newDays.length === 0;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
    const day = date.getDate();
    const month = date.toLocaleDateString('fr-FR', { month: 'short' });
    return `${dayName} ${day} ${month}`;
  }

  confirm(): void {
    this.dialogRef.close({ confirmed: true, newDays: this.newDays });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}

