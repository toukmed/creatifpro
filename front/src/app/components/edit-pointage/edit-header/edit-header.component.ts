import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-edit-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="header-with-return">
      <button
        id="cancel-top"
        mat-fab
        color="primary"
        aria-label="Retour"
        class="mr-10"
        (click)="backClicked.emit()"
      >
        <mat-icon>arrow_back</mat-icon>
      </button>
      <h3 style="flex: 1">
        {{
          isAddition ? 'Création ' : isReadOnly ? 'Visualisation ' : 'Edition '
        }}
        {{ title }}
      </h3>
      @if (!isReadOnly) {
      <button
        [disabled]="isValidateDisabled"
        class="ml-10"
        mat-fab
        color="primary"
        aria-label="Valider"
        (click)="validateClicked.emit()"
      >
        <mat-icon>check</mat-icon>
      </button>
      }
    </div>
  `,
  styles: `
        .header-with-return {
            display: flex;
            align-items: center;
            margin: 0 0 0 4%
        }
      `,
})
export class EditHeaderComponent {
  @Input()
  isAddition: boolean;
  @Input()
  isReadOnly: boolean;
  @Input()
  isValidateDisabled: boolean;
  @Input()
  title: string;
  @Output()
  backClicked = new EventEmitter();
  @Output()
  validateClicked = new EventEmitter();
}

