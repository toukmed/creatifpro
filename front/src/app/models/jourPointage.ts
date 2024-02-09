import { Projet } from './projet';
import { Resource } from './resource';

export class JourPointage extends Resource {
  jourPointage: Date;
  pointage: number;
  pointageSupplementaire: number;
  projet: Projet;
  pointages: [];
}

