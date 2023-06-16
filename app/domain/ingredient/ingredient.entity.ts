import type { whereCompoundConditions } from "~/lib/firestore-model/src";
import { ProductEntity } from "../product/product.entity";
import type { Product, ProductInfo } from "../product/product.model.server";

interface IngredientInfo extends ProductInfo {
  type: "ingredient";
}

export interface Ingredient extends Product {
  info: IngredientInfo;
}

class IngredientEntity extends ProductEntity {
  override async findAll(
    conditions?: whereCompoundConditions | undefined
  ): Promise<Ingredient[]> {
    const ingredients = await super.findAll([
      ...(conditions ?? []),
      {
        field: "info.type",
        op: "==",
        value: "ingredient",
      },
    ]);

    // sort by name
    ingredients.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }

      if (a.name > b.name) {
        return 1;
      }

      return 0;
    });

    return ingredients as Ingredient[];
  }

  override async create(product: Product): Promise<Product> {
    return await super.create({
      ...product,
      info: {
        ...product.info,
        type: "ingredient",
      },
    });
  }
}

const ingredientEntity = new IngredientEntity();

export { ingredientEntity };
