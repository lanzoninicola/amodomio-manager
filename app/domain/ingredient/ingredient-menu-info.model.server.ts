import { createFirestoreModel } from "~/lib/firestore-model/src";

interface IngredientMenuInfo {
  id?: string;
  ingredientId: string;
  description: string;
  italianIngredientName: string;
  isVegetarian: boolean;
  isGlutenFree: boolean;
}

const IngredientMenuInfoModel = createFirestoreModel<IngredientMenuInfo>(
  "ingredients_menu_info"
);

export { IngredientMenuInfoModel, type IngredientMenuInfo };
