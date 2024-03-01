import { Validators } from '@angular/forms';
import { FieldType, Resource } from './resource';
import { Field } from '../edit-page/edit-page.component';

export class Projet extends Resource {
  nom: string;
  reference: string;
}

export const projetEditFields = [
  {
    name: 'nom',
    displayName: 'Nom',
    type: FieldType.string,
    validators: Validators.required,
  } as Field,
  {
    name: 'reference',
    displayName: 'Référence',
    type: FieldType.string,
    validators: Validators.required,
  } as Field,
];
