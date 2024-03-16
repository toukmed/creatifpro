import { FieldType, Resource } from './resource';
import { Projet } from './projet';
import { Field } from '../edit-page/edit-page.component';
import { Validators } from '@angular/forms';

export class Employe extends Resource {
  nom: string;
  prenom: string;
  cin: string;
  numeroTelephone: string;
  dateIntegration: Date;
  typeContrat: TypeContrat;
  poste: string;
  tarifJournalier: number;
  salaireMensuel: number;
  projet: Projet;
}

export enum TypeContrat {
  CDI,
  CDD,
  HORAIRE,
}

export const employeEditFields = [
  {
    name: 'nom',
    displayName: 'Nom',
    type: FieldType.string,
    validators: Validators.required,
  } as Field,
  {
    name: 'prenom',
    displayName: 'Prenom',
    type: FieldType.string,
    validators: Validators.required,
  } as Field,
  {
    name: 'cin',
    displayName: 'Cin',
    type: FieldType.string,
    validators: Validators.required,
  } as Field,
  {
    name: 'numeroTelephone',
    displayName: 'Numéro de téléphone',
    type: FieldType.string,
    validators: Validators.required,
  } as Field,
  {
    name: 'typeContrat',
    displayName: 'Type Contrat',
    type: FieldType.string,
    validators: Validators.required,
    staticValues: ['CDD', 'CDI', 'HORAIRE'],
  } as Field,
  {
    name: 'projet',
    displayName: 'Projet',
    type: FieldType.entity,
  } as Field,
  {
    name: 'poste',
    displayName: 'Poste',
    type: FieldType.string,
    validators: Validators.required,
  } as Field,
  {
    name: 'tarifJournalier',
    displayName: 'Tarif journalier',
    type: FieldType.string,
  } as Field,
  {
    name: 'salaireMensuel',
    displayName: 'Salaire mensuel',
    type: FieldType.string,
    validators: Validators.required,
  } as Field,
  {
    name: 'dateIntegration',
    displayName: 'Date intégration',
    type: FieldType.string,
    validators: Validators.required,
  } as Field,
];
