import { createFirestoreModel } from "~/lib/firestore-model/src";
import type { Product, ProductInfo } from "../product/product.model.server";
import type { Size } from "../size/size.model.server";
import type { Category } from "../category/category.model.server";

export type CatalogType = "pizza" | "drinks" | "combo" | "promo";

export interface Catalog {
  id?: string;
  name: string;
  type: CatalogType;
  items?: CatalogItem[];
}

export interface CatalogItem {
  parentId?: Catalog["id"];
  product: Product;
  category: Category;
  unitPrice: number;
  unitPromotionPrice?: number;
}

export interface PizzasCatalog extends Catalog {}

interface ToppingInfo extends ProductInfo {
  type: "semi_manufactured";
}

export interface Topping extends Product {
  info: ToppingInfo;
}

export interface PizzasCatalogItem extends CatalogItem {
  size: Size;
  topping: Topping;
}

const CatalogModel = createFirestoreModel<Catalog>("catalogs");

export { CatalogModel };
