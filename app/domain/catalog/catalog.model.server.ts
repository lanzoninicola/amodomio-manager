import { createFirestoreModel } from "~/lib/firestore-model/src";
import type { Product, ProductInfo } from "../product/product.model.server";
import type { Size } from "../size/size.model.server";
import type { Category, CategoryMenu } from "../category/category.model.server";
import type { Pizza, Topping } from "../pizza/pizza.entity.server";

export type CatalogType = "pizza" | "drinks" | "combo" | "promo";

export interface Catalog {
  id?: string;
  name: string;
  type: CatalogType;
  items?: CatalogItem[];
}

export interface CatalogItem {
  catalogId?: Catalog["id"];
  product: {
    id: Product["id"];
  };
}

const CatalogModel = createFirestoreModel<Catalog>("catalogs");

export { CatalogModel };
