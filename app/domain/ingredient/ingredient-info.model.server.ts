import { createFirestoreModel } from "~/lib/firestore-model/src";

interface IngredientInfo {
  id?: string;
  ingredientId: string;
  description: string;
  nutrionalInfo?: {
    calories: number;
    fat: number;
    protein: number;
    carbs: number;
  };
}

const IngredientInfoModel =
  createFirestoreModel<IngredientInfo>("ingredients_info");

export { IngredientInfoModel, type IngredientInfo };
