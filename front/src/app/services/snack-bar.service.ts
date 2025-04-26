import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  private _snackBar = inject(MatSnackBar);

  constructor() {}

  openBar(message: string, type: string) {
    this._snackBar.open(message, 'OK', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      direction: 'ltr',
      announcementMessage: 'test anouncement message',
      panelClass: 'success-snackbar',
    });
  }
}
