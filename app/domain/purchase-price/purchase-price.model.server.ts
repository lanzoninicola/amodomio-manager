import { createFirestoreModel } from "~/lib/firestore-model/src";
import { type Supplier } from "../supplier/supplier.model.server";

export type PurchasePriceType = "latest_cost" | "average_cost";

export interface PurchasePrice {
  id?: string;
  supplier?: Supplier | null;
  type: PurchasePriceType;
  validFrom: string;
  unitPrice: number;
}

export interface LatestCostPurchasePrice extends PurchasePrice {
  type: "latest_cost";
  supplier: Supplier;
}

export interface AverageCostPurchasePrice extends PurchasePrice {
  type: "average_cost";
}

export type LatestCost = LatestCostPurchasePrice["unitPrice"];

const PurchasePriceModel =
  createFirestoreModel<PurchasePrice>("purchase_prices");

export { PurchasePriceModel };
