import { createFirestoreModel } from "~/lib/firestore-model/src";

export interface MenuItem {
  id?: string;
  name?: string;
  description?: string;
  ingredients?: string[];
  ingredientsIta?: string[];
  price?: string;
  visible?: boolean;
  category?: {
    id: string;
  };
  sortOrder?: number;
}

const MenuItemModel = createFirestoreModel<MenuItem>("menu_items");

export { MenuItemModel };
