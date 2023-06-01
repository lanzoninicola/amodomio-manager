import { createFirestoreModel } from "~/lib/firestore-model/src";

interface ProductInfo {
  id?: string;
  productId: string;
  description: string;
  isAlternativeDescriptionOnMenu: boolean;
  alternativeDescriptionOnMenu?: string;
  isAlsoAnIngredient: boolean;
  visibleOnMenu: boolean;
}

const ProductInfoModel = createFirestoreModel<ProductInfo>("products_info");

export { ProductInfoModel, type ProductInfo };
