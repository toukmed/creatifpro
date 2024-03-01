import { Projet } from './projet';
import { Resource } from './resource';

export class JourPointage extends Resource {
  jourPointage: string;
  pointage: number;
  pointageSupplementaire: number;
  projet: Projet | null;
}

