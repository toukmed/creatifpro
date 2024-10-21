import { Resource } from './resource';
import { Projet } from './projet';

export class Employe extends Resource {
  nom: string;
  prenom: string;
  cin?: string;
  numeroTelephone?: string;
  dateIntegration?: Date;
  typeContrat?: TypeContrat;
  poste: string;
  tarifJournalier?: number;
  salaireMensuel?: number;
  projet?: Projet;
}

export enum TypeContrat {
  CDI,
  CDD,
  HORAIRE,
}
