import { createFirestoreModel } from "~/lib/firestore-model/src";

export interface CartItem {
  id?: string;
  cartId: string;
  productId: string;
  size: {
    id: string;
  };
  toppingsAmount: number;
  toppings: {
    id: string;
  }[];
  quantity: number;
  unit: string;
  price: number;
  observation: string;
}

const CartItemModel = createFirestoreModel<CartItem>("carts_items");

export { CartItemModel };
