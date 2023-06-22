import { createFirestoreModel } from "~/lib/firestore-model/src";

export interface CartTotals {
  id?: string;
  orderId: string;
  subTotal: number;
  deliveryFee: number;
  total: number;
}

const CartTotalsModel = createFirestoreModel<CartTotals>("carts-totals");

export { CartTotalsModel };
