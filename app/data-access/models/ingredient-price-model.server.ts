import { createFirestoreModel } from "~/lib/firestore-model/src";

interface IngredientPrice {
  id?: string;
  ingredientId: string;
  supplierId: string;
  unit: string;
  quantity: number;
  price: number;
}

const IngredientPriceModel =
  createFirestoreModel<IngredientPrice>("ingredients-prices");

export { IngredientPriceModel, type IngredientPrice };
