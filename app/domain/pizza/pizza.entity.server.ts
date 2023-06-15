import type { Product, ProductInfo } from "../product/product.model.server";
import type { Size } from "../size/size.model.server";

// A pizza is a product with variation of sizes
export interface Pizza extends Product {
  sizes: PizzaSizeVariation[];
}

// each size has a variation of toppings
export interface PizzaSizeVariation extends Size {
  toppings: Topping[];
}

interface ToppingInfo extends ProductInfo {
  type: "prepared";
}

export interface Topping extends Product {
  info: ToppingInfo;
}
