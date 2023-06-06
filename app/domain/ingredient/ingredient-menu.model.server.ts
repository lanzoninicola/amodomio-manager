import { createFirestoreModel } from "~/lib/firestore-model/src";

interface IngredientMenu {
  id?: string;
  ingredientId: string;
  italianName: string;
}

const IngredientMenuModel =
  createFirestoreModel<IngredientMenu>("ingredients_info");

export { IngredientMenuModel, type IngredientMenu };
