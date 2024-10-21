import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  formatDateToString,
  formatMonthRange,
  getDatesInRange,
} from '../../../../../utils/utils';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ResourceService } from '../../../../../services/resource.service';
import { JourPointage } from '../../../../../models/jourPointage';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from '../../../../../services/snack-bar.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-week-pointage',
  templateUrl: './add-week-pointage.component.html',
  styleUrl: './add-week-pointage.component.scss',
})
export class AddWeekPointageComponent implements OnInit {
  readonly formatMonthRange = formatMonthRange;
  addPointageForm: FormGroup;

  @Input()
  rangeDate: any;

  @Output()
  nextWeekEmiter: EventEmitter<any> = new EventEmitter();
  @Output()
  previousWeekEmiter: EventEmitter<any> = new EventEmitter();
  @Output()
  nextMonthEmiter: EventEmitter<any> = new EventEmitter();
  @Output()
  previousMonthEmiter: EventEmitter<any> = new EventEmitter();
  @Output()
  refreshCalendar: EventEmitter<any> = new EventEmitter();

  @Input()
  viewDate: Date = new Date();
  @Input()
  isReadOnly: boolean;

  alreadyCreatedPointage = [];
  idPointage: string;

  constructor(
    private jourPointageService: ResourceService<JourPointage>,
    private route: ActivatedRoute,
    private snackBarService: SnackBarService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.idPointage = this.route.snapshot.paramMap.get('id');
    this.initForm();
  }

  initForm() {
    this.addPointageForm = new FormGroup({
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      pointage: new FormControl('', Validators.required),
      idPointage: new FormControl(this.idPointage),
      jourPointage: new FormControl(''),
    });
  }

  addWeeklyPointage() {
    const startDate = this.addPointageForm.controls['startDate'].value;
    const endDate = this.addPointageForm.controls['endDate'].value;

    const dateList = getDatesInRange(
      startDate.toLocaleDateString('en-GB'),
      endDate.toLocaleDateString('en-GB')
    );

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '650px';
    dialogConfig.height = '250px';
    dialogConfig.data = `Etes vous sur de vouloir créer le pointage sur la plage horaire [${startDate.toLocaleDateString(
      'en-GB'
    )} - ${endDate.toLocaleDateString('en-GB')}]`;
    this.dialog
      .open(ConfirmDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        this.createBulk(dateList);
        this.refreshCalendar.emit();
      });
  }

  createBulk(dateList: Date[]) {
    let count = 0;
    dateList.forEach((date) => {
      this.jourPointageService
        .isExistBy(
          'jourPointages',
          this.idPointage,
          date.toLocaleDateString('en-GB')
        )
        .subscribe((exist) => {
          if (!exist) {
            this.addPointageForm.controls['jourPointage'].setValue(
              date.toLocaleDateString('en-GB')
            );
            this.jourPointageService
              .create(this.addPointageForm.value, 'jourPointages')
              .subscribe((resp) => {
                this.refreshCalendar.emit();
              });
          }
        });
    });
  }

  previousWeek() {
    this.previousWeekEmiter.emit();
  }
  nextWeek() {
    this.nextWeekEmiter.emit();
  }
  previousMonth() {
    this.previousMonthEmiter.emit();
  }
  nextMonth() {
    this.nextMonthEmiter.emit();
  }
}
