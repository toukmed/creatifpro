import { Resource } from './resource';

export type EtatProjet = 'EN_ATTENTE' | 'EN_COURS' | 'TERMINE';

export const ETAT_PROJET_OPTIONS: { value: EtatProjet; label: string }[] = [
  { value: 'EN_ATTENTE', label: 'En attente' },
  { value: 'EN_COURS', label: 'En cours' },
  { value: 'TERMINE', label: 'Terminé' },
];

export class Project extends Resource {
  code: string;
  reference: string;
  client?: string;
  nBc?: string;
  designation?: string;
  etatProjet?: EtatProjet;
}
