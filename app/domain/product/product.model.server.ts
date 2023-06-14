import { createFirestoreModel } from "~/lib/firestore-model/src";
import type { CategoryMenu } from "../category/category.model.server";

export interface Product {
  id?: string;
  name: string;
  unit: ProductUnit;
  info?: ProductInfo | null;
  menu?: ProductMenu;
  stock?: ProductStock;
  components?: ProductComponent[];
}

export interface RawMaterialProduct extends Product {
  type: "raw_material";
}

export interface SemiManufacturedProduct extends Product {
  type: "semi_manufactured";
}

export type ProductType =
  | "simple"
  | "kit"
  | "manufactured"
  | "raw_material"
  | "semi_manufactured";

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

const ProductModel = createFirestoreModel<Product>("products");

export { ProductModel };
