import { Produit } from './produit';

export interface EtatStock {
  produit: Produit;
  totalEntrees: number;
  totalSorties: number;
  stockDisponible: number;
  valeurStock: number;
  seuilAlerte: number;
  enAlerte: boolean;
}

