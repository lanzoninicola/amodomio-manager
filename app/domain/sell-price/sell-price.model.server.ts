import { createFirestoreModel } from "~/lib/firestore-model/src";

export interface SellPrice {
  id?: string;
  validFrom: string;
  markup: number;
  unitPrice: number;
  unitPromotionalPrice: number;
}

export interface LatestSellPrice {
  unitPrice: number;
  unitPromotionalPrice: number;
}

const SellPriceModel = createFirestoreModel<SellPrice>("sell_prices");

export { SellPriceModel };
