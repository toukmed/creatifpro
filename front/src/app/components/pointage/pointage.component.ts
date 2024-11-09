import { Component, OnInit, signal } from '@angular/core';
import { columns } from './pointage.variables';
import { ResourceService } from '../../services/resource.service';
import { Pointage } from '../../models/pointage';
import { Router } from '@angular/router';
import {
  formatDateToDashedString,
  formatDateToString,
  getEndOfWeek,
  getEndOfWeekDate,
  getStartOfWeek,
  getStartOfWeekDate,
} from '../../utils/date-utils';
import { MatDialog } from '@angular/material/dialog';
import { AddPointageComponent } from './details/add-pointage/add-pointage.component';
import { Projet } from '../../models/projet';
import { FormControl, FormGroup } from '@angular/forms';
import { dialogConfig } from '../../utils/utils';
import {
  Color,
  LegendPosition,
  ScaleType,
  ViewDimensions,
} from '@swimlane/ngx-charts';

const weekStart = getStartOfWeek(new Date());
const weekEnd = getEndOfWeek(new Date());

@Component({
  selector: 'app-pointage',
  templateUrl: './pointage.component.html',
  styleUrl: './pointage.component.scss',
})
export class PointageComponent implements OnInit {
  readonly currentWeekNavigated: Date = new Date();
  readonly filterForm = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    typeContrat: new FormControl<string>('HORAIRE'),
  });
  readonly columns = columns;
  readonly dialogConfig = dialogConfig;
  readonly endpoint: string = 'pointages';

  pointages: Pointage[];
  projects: any;
  typeContrat: string = 'HORAIRE';
  exporting = false;
  showChartsClicked = false;
  employeName: string;
  stats: any[];

  // Start Chart data
  pointagePaimentStatus = [
    {
      name: 'Payé',
      value: 63,
    },
    {
      name: 'Impayé',
      value: 37,
    },
  ];
  pointageFillStatus = [
    {
      name: 'Saisi',
      value: 70,
    },
    {
      name: 'Non Saisi',
      value: 30,
    },
  ];
  pointageAbsenceStatus = [
    {
      name: 'Abscence',
      value: 13,
    },
    {
      name: 'presence',
      value: 87,
    },
  ];
  view: [number, number] = [450, 200];

  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition = LegendPosition.Right;
  colorScheme = {
    name: 'fire',
    selectable: true,
    group: ScaleType.Linear,
    domain: ['#E65100', '#FF6433', '#CC5E3D', '#FFA533', '#FF6F00', '#FF794E'],
  };
  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }
  // End Chart data

  constructor(
    private service: ResourceService<Pointage>,
    private projectService: ResourceService<Projet>,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initFilterForm(this.currentWeekNavigated);
    this.listPointage(weekStart, weekEnd, this.typeContrat);
    this.filterForm.controls['typeContrat'].valueChanges.subscribe((value) => {
      this.typeContrat = value;
      this.listPointage(weekStart, weekEnd, this.typeContrat);
    });
  }

  initFilterForm(date: Date) {
    this.filterForm.controls['start'].setValue(getStartOfWeekDate(date));
    this.filterForm.controls['end'].setValue(getEndOfWeekDate(date));
  }

  listPointage(weekStart: any, weekEnd: any, typeContrat: string) {
    this.service
      .list(
        {
          libelle: '',
          startDate: weekStart,
          endDate: weekEnd,
          typeContrat: typeContrat,
          size: 10000,
        },
        this.endpoint
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
        this.endpoint
      )
      .subscribe((resp) => {
        this.pointages = resp.content;
      });
  }

  edit(configuration: any, details: boolean) {
    let array = [this.endpoint, configuration.id];
    if (details) array.push('visu');
    this.router.navigate(array);
  }

  add() {
    this.projectService.list({ libelle: '' }, 'projets').subscribe((resp) => {
      const dialogConfig = this.dialogConfig(
        { projects: resp.content, fromMainPage: true },
        '1000px',
        '700px'
      );
      this.dialog
        .open(AddPointageComponent, dialogConfig)
        .afterClosed()
        .subscribe((resp) => {
          if (resp) this.listPointage(weekStart, weekEnd, this.typeContrat);
        });
    });
  }

  export() {
    this.exporting = true;
    const startDate = this.filterForm.controls['start'].value;
    const endDate = this.filterForm.controls['end'].value;
    const typeContrat = this.filterForm.controls['typeContrat'].value;
    this.service
      .exportToCSV(
        formatDateToString(startDate),
        formatDateToString(endDate),
        typeContrat,
        this.endpoint
      )
      .subscribe((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `Pointage_${formatDateToDashedString(
          startDate
        )}_${formatDateToDashedString(endDate)}.csv`;
        anchor.click();
        window.URL.revokeObjectURL(url);
        setTimeout(() => {
          this.exporting = false;
        }, 2000);
      });
  }

  loadChartData(data: any) {
    console.log(data);
    this.employeName = (
      data.row.employe.nom +
      ' ' +
      data.row.employe.prenom
    ).toUpperCase();
    this.showChartsClicked = data.clicked;
    if (this.showChartsClicked) {
      this.service
        .getStats(data.row.id, 'jourPointages')
        .subscribe((resp: any[]) => {
          this.stats = resp;
        });
    }
  }

  private setDateNavigationAndListPointage(navigationWeek: Date) {
    const weekStart = getStartOfWeek(navigationWeek);
    const weekEnd = getEndOfWeek(navigationWeek);
    this.listPointage(weekStart, weekEnd, this.typeContrat);
  }
}
