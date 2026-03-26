import { Resource } from './resource';
import { Project } from './projet';

export class Employe extends Resource {
  firstName: string;
  lastName: string;
  cin?: string;
  phoneNumber?: string;
  integrationDate?: Date;
  jobRole: string;
  hourlyRate?: number;
  salary?: number;
  projet?: Project;
}

