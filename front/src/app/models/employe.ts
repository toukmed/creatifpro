import { Resource } from './resource';
import { Project } from './projet';

export class Employe extends Resource {
  firstName: string;
  lastName: string;
  cin?: string;
  phoneNumber?: string;
  dateIntegration?: Date;
  jobRole: string;
  hourlyRate?: number;
  salary?: number;
  chantier?: string;
  nCnss?: string;
  rib?: string;
  project?: Project;
  projectId?: number;
}

