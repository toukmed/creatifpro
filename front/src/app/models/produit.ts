import { Resource } from './resource';

export type TypeProduit = 'MATERIAU' | 'OUTILLAGE' | 'CONSOMMABLE' | 'QUINCAILLERIE' | 'EQUIPEMENT';
export type UniteProduit = 'LITRE' | 'KG' | 'METRE' | 'UNITE' | 'SACS' | 'M2' | 'M3';

export class Produit extends Resource {
  nomProduit: string;
  typeProduit: TypeProduit;
  uniteProduit: UniteProduit;
  seuilAlerte: number;
  description: string;
}

