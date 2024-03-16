import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgClass } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { displayFn } from '../../../utils/utils';
import { Field } from '../../edit-page.component';
import { ResourceService } from '../../../services/resource.service';
import { Resource } from '../../../models/resource';

@Component({
  selector: 'app-entity-field',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatAutocompleteModule,
    NgClass,
    MatTooltipModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <mat-form-field
      style="align-self: start;"
      color="accent"
      subscriptSizing="dynamic"
      class="full-width"
      [formGroup]="formGroup"
      appearance="outline"
    >
      <mat-label>{{ field.displayName }}</mat-label>
      <input
        [matAutocomplete]="auto"
        matInput
        type="text"
        [disabled]="field.disabled"
        (keyup)="filterList($event)"
        [formControlName]="field.name"
      />
      <mat-icon (click)="clearInput($event)" matSuffix>cancel</mat-icon>
      <mat-autocomplete
        (optionSelected)="entitySelected.emit(field.name)"
        requireSelection
        #auto="matAutocomplete"
        [displayWith]="displayFn"
      >
        @for (el of fields; track $index) {
        <mat-option [value]="el">
          <span>{{ displayFn(el) }}</span>
        </mat-option>
        }
      </mat-autocomplete>
    </mat-form-field>
  `,
  styles: `
        .mat-mdc-option {
            flex-direction: row-reverse;
        }
    `,
})
export class EntityFieldComponent {
  @Output()
  entitySelected = new EventEmitter();
  @Input()
  field: Field;
  @Input()
  formGroup: FormGroup;
  @Input()
  entityName: string;
  @Input()
  isReadOnly: boolean;
  fields: Resource[];
  protected readonly displayFn = displayFn;

  constructor(private service: ResourceService<Resource>) {}

  filterList(event: any) {
    this.service
      .list({ libelle: event.target.value }, this.field.name + 's')
      .subscribe((resp) => {
        this.fields = resp.content;
      });
  }

  clearInput(event: any) {
    if (!this.isReadOnly) {
      this.formGroup.get(this.field.name)?.setValue('');
      this.filterList(event);
    }
  }
}
