import { Resource } from './resource';
import { Projet } from './projet';

export class Personnel extends Resource {
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

const enum TypeContrat {CDI, CDD, HORAIRE}