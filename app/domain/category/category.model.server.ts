import { createFirestoreModel } from "~/lib/firestore-model/src";

interface Category {
  id?: string;
  name: string;
  type: "group" | "menu";
}

interface CategoryMenu extends Category {
  type: "menu";
}

const CategoryModel = createFirestoreModel<Category>("categories");

export { CategoryModel, type Category, type CategoryMenu };
