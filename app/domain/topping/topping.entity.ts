import type { whereCompoundConditions } from "~/lib/firestore-model/src";
import { ProductEntity } from "../product/product.entity";
import type { Product, ProductInfo } from "../product/product.model.server";

interface ToppingInfo extends ProductInfo {
  type: "topping";
}

export interface Topping extends Product {
  info: ToppingInfo;
}

class ToppingEntity extends ProductEntity {
  override async findAll(
    conditions?: whereCompoundConditions | undefined
  ): Promise<Topping[]> {
    const toppings = await super.findAll([
      ...(conditions ?? []),
      {
        field: "info.type",
        op: "==",
        value: "topping",
      },
    ]);

    // sort by name
    toppings.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }

      if (a.name > b.name) {
        return 1;
      }

      return 0;
    });

    return toppings as Topping[];
  }

  override async create(product: Product): Promise<Product> {
    return await super.create({
      ...product,
      info: {
        ...product.info,
        type: "topping",
      },
    });
  }
}

const toppingEntity = new ToppingEntity();

export { toppingEntity };
