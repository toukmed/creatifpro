import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {

  @Output()
  confirmAction = new EventEmitter<boolean>(); 

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {}

  onConfirm(){

  }
}
