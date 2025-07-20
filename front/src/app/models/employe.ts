import { Resource } from './resource';
import { Project } from './projet';

export class Employe extends Resource {
  firstName: string;
  lastName: string;
  cin?: string;
  phoneNumber?: string;
  integrationDate?: Date;
  contractType?: ContractType;
  jobRole: string;
  hourlyRate?: number;
  salary?: number;
  projet?: Project;
}

export enum ContractType {
  SALARIE,
  HORAIRE,
}
