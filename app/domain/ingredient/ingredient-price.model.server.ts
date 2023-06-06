import {
  createFirestoreModel,
  type TFirestoreModel,
} from "~/lib/firestore-model/src";

interface IngredientPrice {
  id?: string;
  ingredientId: string;
  supplierId: string;
  unit: string;
  quantity: number;
  price: number;
  unitPrice: number;
  defaultPrice: boolean;
}

type TIngredientPriceModel = TFirestoreModel<IngredientPrice>;

const IngredientPriceModel =
  createFirestoreModel<TIngredientPriceModel>("ingredients_prices");

export {
  IngredientPriceModel,
  type IngredientPrice,
  type TIngredientPriceModel,
};
