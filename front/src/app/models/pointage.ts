import { Employe } from './employe';
import { Resource } from './resource';
import { Project } from './projet';

export class Pointage extends Resource {
  employee: Employe;
  project: Project;
  pointageDate: Date;
  workedDays: number;
  comment: string;
  isPaid: boolean;
}
