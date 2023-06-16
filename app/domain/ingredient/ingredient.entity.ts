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
  override findAll(
    conditions?: whereCompoundConditions | undefined
  ): Promise<Ingredient[]> {
    return super.findAll([
      ...(conditions ?? []),
      {
        field: "info.type",
        op: "==",
        value: "ingredient",
      },
    ]) as Promise<Ingredient[]>;
  }
}

const ingredientEntity = new IngredientEntity();

export { ingredientEntity };
