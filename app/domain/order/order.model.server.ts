import { createFirestoreModel } from "~/lib/firestore-model/src";

export type OrderStatus =
  | "sent"
  | "received"
  | "preparing"
  | "delivering"
  | "delivered"
  | "cancelled";

export interface Order {
  id?: string;
  status: OrderStatus;
  phoneNumber: string;
  cep: string;
  deliveryAddress: OrderDeliveryAddress;
  observation: string;
}

export interface OrderDeliveryAddress {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

const OrderModel = createFirestoreModel<Order>("orders");

export { OrderModel };
