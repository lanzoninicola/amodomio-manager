import { createFirestoreModel } from "~/lib/firestore-model/src";

export interface OrderItem {
  id?: string;
  orderId: string;
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

const OrderItemModel = createFirestoreModel<OrderItem>("orders_items");

export { OrderItemModel };
