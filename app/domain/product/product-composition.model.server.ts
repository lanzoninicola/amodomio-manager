import { createFirestoreModel } from "~/lib/firestore-model/src";

export type ComponentType = "ingredient" | "product";

interface ProductComposition {
  id?: string;
  productId: string;
  // this can be either an ingredient or a product
  componentId: string;
  componentType: ComponentType;
  // this is the unit of the element
  unit: string;
  // this is the quantity of the element in the product
  quantity: number;
}

const ProductCompositionModel = createFirestoreModel<ProductComposition>(
  "products_compositions"
);

export { ProductCompositionModel, type ProductComposition };
