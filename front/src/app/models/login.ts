import { Resource } from './resource';

export class Login extends Resource {
  login: string;
  password: string;
  nom?: string;
  prenom?: string;
  email?: string;
}
