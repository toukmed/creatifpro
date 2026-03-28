import { Resource } from './resource';

export type EtatPaiement = 'PAYE' | 'PAIEMENT_EN_ATTENTE';

export const ETAT_PAIEMENT_OPTIONS: { value: EtatPaiement; label: string }[] = [
  { value: 'PAYE', label: 'Payé' },
  { value: 'PAIEMENT_EN_ATTENTE', label: 'Paiement en attente' },
];

export class Facture extends Resource {
  numFacture: string;
  nBc: string;
  montantTtc: string;
  projectId: number;
  projectCode: string;
  dateFacture: string;
  etatPaiement: EtatPaiement;
  datePaiement: string;
}

