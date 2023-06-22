import { createFirestoreModel } from "~/lib/firestore-model/src";
import type { OrderDeliveryAddress } from "../order/order.model.server";

export type CartStatus = "open" | "closed";

export interface Cart {
  id?: string;
  status: CartStatus;
  phoneNumber?: string;
  cep?: string;
  deliveryAddress?: OrderDeliveryAddress;
  observation?: string;
}

const CartModel = createFirestoreModel<Cart>("carts");

export { CartModel };
