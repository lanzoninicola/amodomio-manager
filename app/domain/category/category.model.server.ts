import { createFirestoreModel } from "~/lib/firestore-model/src";

interface Category {
  id?: string;
  name: string;
  type: "topping" | "menu";
  sortOrder?: number;
  visible: boolean;
  default?: boolean;
}

interface CategoryMenu extends Category {
  type: "menu";
}

const CategoryModel = createFirestoreModel<Category>("categories");

export { CategoryModel, type Category, type CategoryMenu };
