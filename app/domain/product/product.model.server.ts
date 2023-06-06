import { createFirestoreModel } from "~/lib/firestore-model/src";

interface Product {
  id?: string;
  name: string;
  disabled: boolean;
  cost?: number;
}

const ProductModel = createFirestoreModel<Product>("products");

export { ProductModel, type Product };
