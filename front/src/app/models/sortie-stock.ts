import { Resource } from './resource';
import { Produit } from './produit';

export class SortieStock extends Resource {
  produit: Produit;
  quantite: number;
  project: any;
  dateSortie: string;
  demandeur: string;
  referenceDocument: string;
  commentaire: string;
}
