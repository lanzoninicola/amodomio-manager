import { createFirestoreModel } from "~/lib/firestore-model/src";

interface ProductInfo {
  id?: string;
  productId: string;
  description: string;
  isAlsoAnIngredient: boolean;
}

const ProductInfoModel = createFirestoreModel<ProductInfo>("products_info");

export { ProductInfoModel, type ProductInfo };
