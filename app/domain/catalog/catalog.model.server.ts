import { createFirestoreModel } from "~/lib/firestore-model/src";
import type { Product, ProductInfo } from "../product/product.model.server";
import type { Size } from "../size/size.model.server";
import type { Category } from "../category/category.model.server";
import type { Pizza } from "../pizza/pizza.entity.server";

export type CatalogType = "pizza" | "drinks" | "combo" | "promo";

export interface Catalog {
  id?: string;
  name: string;
  type: CatalogType;
  items?: CatalogItem[];
}

export interface CatalogItem {
  catalogId?: Catalog["id"];
  product: Product;
}

// PIZZA CATALOG //
export type PizzaCatalog = Omit<Catalog, "items"> & {
  type: "pizza";
  // array of Product with the pizza attributes (sizes, toppings)
  items?: PizzaCatalogItem[];
};

export interface PizzaCatalogItem extends CatalogItem {
  product: Pizza;
}

const CatalogModel = createFirestoreModel<Catalog>("catalogs");

export { CatalogModel };
