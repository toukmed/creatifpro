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
  project?: Project;
  projectId?: number;
}

