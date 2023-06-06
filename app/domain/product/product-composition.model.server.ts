import { createFirestoreModel } from "~/lib/firestore-model/src";

interface ProductComposition {
  id?: string;
  productId: string;
  // this can be either an ingredient or a product
  elementId: string;
  elementType: "ingredient" | "product";
  unit: string;
  quantity: number;
  cost: number;
}

const ProductCompositionModel = createFirestoreModel<ProductComposition>(
  "products_compositions"
);

export { ProductCompositionModel, type ProductComposition };
