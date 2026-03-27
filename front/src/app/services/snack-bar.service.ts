import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export type SnackBarType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  private _snackBar = inject(MatSnackBar);

  openBar(message: string, type: SnackBarType = 'info') {
    const panelClass = `snackbar-${type}`;
    const duration = type === 'error' ? 5000 : 3500;

    this._snackBar.open(message, '✕', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass,
    });
  }

  success(message: string) {
    this.openBar(message, 'success');
  }

  error(message: string) {
    this.openBar(message, 'error');
  }

  warning(message: string) {
    this.openBar(message, 'warning');
  }

  info(message: string) {
    this.openBar(message, 'info');
  }
}
