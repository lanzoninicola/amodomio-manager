import { createFirestoreModel } from "~/lib/firestore-model/src";

interface Ingredient {
  id?: string;
  name: string;
}

const IngredientModel = createFirestoreModel<Ingredient>("ingredients");

export { IngredientModel, type Ingredient };
