import { createFirestoreModel } from "~/lib/firestore-model/src";

export interface OrderTotals {
  id?: string;
  orderId: string;
  subTotal: number;
  deliveryFee: number;
  total: number;
}

const OrderTotalsModel = createFirestoreModel<OrderTotals>("orders-totals");

export { OrderTotalsModel };
