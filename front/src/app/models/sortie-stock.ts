import { Resource } from './resource';
import { UniteProduit } from './entree-stock';

export class SortieStock extends Resource {
  nomComplet: string;
  nomProduit: string;
  typeProduit: string;
  uniteProduit: UniteProduit;
  poids: number;
  quantite: number;
  chantier: string;
}
