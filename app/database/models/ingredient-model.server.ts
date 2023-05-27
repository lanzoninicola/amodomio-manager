import { createFirestoreModel } from "~/lib/firestore-model/src";

interface Ingredient {
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
}

const IngredientModel = createFirestoreModel<Ingredient>("ingredients");

export default IngredientModel;
