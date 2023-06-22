import { BaseEntity } from "../base.entity";
import type { Cart } from "./cart.model.server";
import { CartModel } from "./cart.model.server";

class CartEntity extends BaseEntity<Cart> {
  override async create() {
    return await super.save({
      status: "open",
    });
  }
}

const cartEntity = new CartEntity(CartModel);

export { cartEntity };
