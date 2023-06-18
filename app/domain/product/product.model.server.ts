import { createFirestoreModel } from "~/lib/firestore-model/src";
import type { CategoryMenu } from "../category/category.model.server";
import type { LatestSellPrice } from "../sell-price/sell-price.model.server";
import { type SellPrice } from "../sell-price/sell-price.model.server";
import type { LatestCost } from "../purchase-price/purchase-price.model.server";
import { type PurchasePrice } from "../purchase-price/purchase-price.model.server";

export interface Product {
  id?: string;
  name: string;
  unit: ProductUnit;
  info?: ProductInfo | null;
  menu?: ProductMenu;
  stock?: ProductStock;
  components?: ProductComponent[];
  pricing?: ProductPricing;
}

export interface RawMaterialProduct extends Product {
  type: "ingredient";
}

export interface SemiManufacturedProduct extends Product {
  type: "prepared";
}

export type ProductType =
  | "simple"
  | "topping" // topping is merely a topping of products that cannot be sold neither separately nor as a topping
  | "pizza" // pizza is a product that is produced and sold by the company itself. The components are raw materials and semi-pizza products. They suffer a transformation process and are cannot be sold.
  | "ingredient" // raw material is a product that is bought from a supplier and is used to produce pizza products
  | "prepared"; // semi-manufactured is a product that is bought from a supplier or produced by the company and is used to produce pizza products

export interface ProductInfo {
  productId?: string;
  type: ProductType;
  description?: string;
}

export interface ProductMenu {
  productId: string;
  category: CategoryMenu;
  show: boolean;
  description: string;
  italianProductName: string;
  isVegetarian: boolean;
  isGlutenFree: boolean;
}

export interface ProductStock {
  productId: string;
  stockCheck: boolean;
  initialQuantity: number;
  currentQuantity: number;
  stockStatus: "in-stock" | "out-of-stock";
}

export type ProductUnit = "gr" | "ml" | "un";

export interface ProductComponent {
  parentId: string;
  product: {
    id: string;
  };
  unit: ProductUnit;
  quantity: number;
  unitCost: number;
}

export interface ProductPricing {
  productId: string;
  latestSellPrice: LatestSellPrice;
  latestCost: LatestCost;
  sellPrices: SellPrice[];
  purchasePrices: PurchasePrice[];
}

const ProductModel = createFirestoreModel<Product>("products");

export { ProductModel };
