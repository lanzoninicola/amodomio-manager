// all the elemnts that are ingredients or products, part of a composition
export interface CompositionElement {
  id?: string;
  name: string;
  type: string;
  unit: string;
  unitPrice: number;
}
