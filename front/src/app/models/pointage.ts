import { Validators } from '@angular/forms';
import { Employe } from './employe';
import { JourPointage } from './jourPointage';
import { Resource } from './resource';

export class Pointage extends Resource {
  employe: Employe;
  datePointage: Date;
  pointages: JourPointage[];
  startDate: Date;
  endDate: Date;
  projet: string;
  totalHours: number;
  employesList: number[];
}
