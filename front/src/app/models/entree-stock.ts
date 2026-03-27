import { Resource } from './resource';

export type UniteProduit = 'LITRE' | 'KG' | 'METRE';

export class EntreeStock extends Resource {
  nomComplet: string;
  nomProduit: string;
  typeProduit: string;
  uniteProduit: UniteProduit;
  poids: number;
  quantite: number;
}
