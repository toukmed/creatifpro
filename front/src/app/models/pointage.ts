import { Personnel } from './personnel';
import { JourPointage } from './jourPointage';
import { Resource } from './resource';

export class Pointage extends Resource {
  employe: Personnel;
  datePointage: Date;
  pointages: JourPointage[];
}

