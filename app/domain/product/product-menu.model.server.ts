import { createFirestoreModel } from "~/lib/firestore-model/src";

interface ProductMenu {
  id?: string;
  productId: string;
  // this can be either an ingredient or a product
  show: boolean;
  description: string;
  italianProductName: string;
}

const ProductMenuModel = createFirestoreModel<ProductMenu>("products_menus");

export { ProductMenuModel, type ProductMenu };
