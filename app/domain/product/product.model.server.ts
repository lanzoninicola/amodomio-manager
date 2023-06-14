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
  type: "raw_material";
}

export interface SemiManufacturedProduct extends Product {
  type: "semi_manufactured";
}

export type ProductType =
  | "simple"
  | "kit" // kit is a product that is composed of other products that can be sold separately
  | "group" // group is merely a group of products that cannot be sold neither separately nor as a group
  | "manufactured" // manufactured is a product that is produced and sold by the company itself. The components are raw materials and semi-manufactured products. They suffer a transformation process and are cannot be sold.
  | "raw_material" // raw material is a product that is bought from a supplier and is used to produce manufactured products
  | "semi_manufactured"; // semi-manufactured is a product that is bought from a supplier or produced by the company and is used to produce manufactured products

export interface ProductInfo {
  productId: string;
  type: ProductType;
  description: string;
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
  product: RawMaterialProduct | SemiManufacturedProduct;
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
