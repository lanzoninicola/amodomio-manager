import { createFirestoreModel } from "~/lib/firestore-model/src";
import type { CategoryMenu } from "../category/category.model.server";

interface Product {
  id?: string;
  name: string;
  info: ProductInfo;
  menu: ProductMenu;
}

interface ProductInfo {
  type: "simple" | "kit" | "manufactured";
  description: string;
}

interface ProductMenu {
  id?: string;
  category: CategoryMenu;
  show: boolean;
  description: string;
  italianProductName: string;
  isVegetarian: boolean;
  isGlutenFree: boolean;
}

const ProductModel = createFirestoreModel<Product>("products");

export { ProductModel, type Product };
