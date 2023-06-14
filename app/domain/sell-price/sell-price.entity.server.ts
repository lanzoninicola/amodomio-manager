import { type SellPrice, SellPriceModel } from "./sell-price.model.server";
import { BaseEntity } from "../base.entity";

class SellPriceEntity extends BaseEntity<SellPrice> {}

const sellPriceEntity = new SellPriceEntity(SellPriceModel);

export { sellPriceEntity };
