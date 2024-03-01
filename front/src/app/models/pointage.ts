import { Validators } from '@angular/forms';
import { Employe } from './employe';
import { JourPointage } from './jourPointage';
import { FieldType, Resource } from './resource';
import { Field } from '../edit-page/edit-page.component';

export class Pointage extends Resource {
  employe: Employe;
  datePointage: Date;
  pointages: JourPointage[];
}

export const pointageEditFields = [
  {
    name: 'employe',
    displayName: 'Employé',
    type: FieldType.entity,
    validators: Validators.required,
  } as Field,
];
