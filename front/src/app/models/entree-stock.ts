import { Resource } from './resource';
import { Produit } from './produit';

export class EntreeStock extends Resource {
  produit: Produit;
  quantite: number;
  prixUnitaire: number;
  fournisseur: string;
  dateEntree: string;
  referenceDocument: string;
  commentaire: string;
}
