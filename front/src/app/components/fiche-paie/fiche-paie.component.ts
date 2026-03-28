import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../services/resource.service';
import { Employe } from '../../models/employe';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-fiche-paie',
  templateUrl: './fiche-paie.component.html',
  styleUrl: './fiche-paie.component.scss',
})
export class FichePaieComponent implements OnInit {
  ficheForm: FormGroup;
  employees: Employe[] = [];
  loading = false;
  loadingEmployees = false;

  // Available months for selection (all months up to last month)
  availableMonths: { value: number; label: string }[] = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' },
  ];

  availableYears: number[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private employeeService: ResourceService<Employe>,
    private snackBar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadEmployees();
    this.buildAvailableYears();
  }

  private initForm(): void {
    const now = new Date();
    // Default to previous month
    let defaultMonth = now.getMonth(); // getMonth() is 0-based, so this gives last month's 1-based value
    let defaultYear = now.getFullYear();
    if (defaultMonth === 0) {
      defaultMonth = 12;
      defaultYear--;
    }

    this.ficheForm = this.fb.group({
      employeeId: [null, Validators.required],
      year: [defaultYear, Validators.required],
      month: [defaultMonth, Validators.required],
    });
  }

  private buildAvailableYears(): void {
    const currentYear = new Date().getFullYear();
    // From 2020 to current year
    for (let y = currentYear; y >= 2020; y--) {
      this.availableYears.push(y);
    }
  }

  loadEmployees(): void {
    this.loadingEmployees = true;
    this.employeeService
      .list({ pageIndex: 0, pageSize: 1000 }, 'employees')
      .subscribe({
        next: (resp: any) => {
          this.employees = resp.content ?? resp;
          this.loadingEmployees = false;
        },
        error: () => {
          this.snackBar.error('Erreur lors du chargement des employés');
          this.loadingEmployees = false;
        },
      });
  }

  getEmployeeLabel(emp: Employe): string {
    return `${emp.firstName} ${emp.lastName}${emp.cin ? ' — ' + emp.cin : ''}`;
  }

  isMonthDisabled(monthValue: number): boolean {
    const selectedYear = this.ficheForm?.get('year')?.value;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-based

    if (selectedYear > currentYear) return true;
    if (selectedYear === currentYear && monthValue >= currentMonth) return true;
    return false;
  }

  onDownload(): void {
    if (this.ficheForm.invalid) return;

    const { employeeId, year, month } = this.ficheForm.value;

    // Validate not current or future month
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    if (year > currentYear || (year === currentYear && month >= currentMonth)) {
      this.snackBar.error(
        'Impossible de générer la fiche de paie pour le mois en cours ou un mois futur.'
      );
      return;
    }

    this.loading = true;

    this.http
      .get(`/api/fiche-paie/employee/${employeeId}?year=${year}&month=${month}`, {
        responseType: 'blob',
      })
      .subscribe({
        next: (blob: Blob) => {
          this.loading = false;
          // Trigger download
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const monthStr = String(month).padStart(2, '0');
          const employee = this.employees.find((e) => e.id === employeeId);
          const empName = employee
            ? `${employee.firstName}_${employee.lastName}`
            : String(employeeId);
          a.download = `Fiche_Paie_${empName}_${monthStr}_${year}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          this.snackBar.success('Fiche de paie téléchargée avec succès');
        },
        error: (err) => {
          this.loading = false;
          // Try to read error message from blob
          if (err.error instanceof Blob) {
            const reader = new FileReader();
            reader.onload = () => {
              try {
                const json = JSON.parse(reader.result as string);
                this.snackBar.error(
                  json.message || 'Erreur lors de la génération de la fiche de paie'
                );
              } catch {
                this.snackBar.error('Erreur lors de la génération de la fiche de paie');
              }
            };
            reader.readAsText(err.error);
          } else {
            this.snackBar.error(
              err.error?.message || 'Erreur lors de la génération de la fiche de paie'
            );
          }
        },
      });
  }
}

