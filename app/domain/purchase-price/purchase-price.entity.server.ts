import {
  type PurchasePrice,
  PurchasePriceModel,
} from "./purchase-price.model.server";
import { BaseEntity } from "../base.entity";

class PurchasePriceEntity extends BaseEntity<PurchasePrice> {}

const purchasePriceEntity = new PurchasePriceEntity(PurchasePriceModel);

export { purchasePriceEntity };
