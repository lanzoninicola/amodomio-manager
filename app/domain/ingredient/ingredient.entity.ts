import { serverError } from "~/utils/http-response.server";
import {
  IngredientInfoModel,
  type IngredientInfo,
} from "./ingredient-info.model.server";
import {
  IngredientPriceModel,
  type IngredientPrice,
} from "./ingredient-price.model.server";
import { type Ingredient, IngredientModel } from "./ingredient.model.server";
import type { whereCompoundConditions } from "~/lib/firestore-model/src";
import type { Supplier } from "../supplier/supplier.model.server";
import { SupplierEntity } from "../supplier/supplier.entity.server";

export interface IngredientPriceWithSupplier extends IngredientPrice {
  supplier: Supplier | null;
}

export interface IngredientWithAssociations extends Ingredient {
  info: IngredientInfo | null;
  prices: IngredientPriceWithSupplier[] | null;
}

export class IngredientEntity {
  async create(ingredient: Ingredient): Promise<Ingredient> {
    this.validate(ingredient);
    return this.save(ingredient);
  }

  private async save(ingredient: Ingredient): Promise<Ingredient> {
    return await IngredientModel.add(ingredient);
  }

  async findAll(): Promise<Ingredient[]> {
    return await IngredientModel.findAll();
  }

  async findById(
    id: string,
    options = {
      includeAssociations: true,
    }
  ): Promise<Ingredient | IngredientWithAssociations | null> {
    let ingredient = await IngredientModel.findById(id);

    if (!ingredient) {
      return null;
    }

    if (options.includeAssociations === false) {
      return ingredient;
    }

    const ingredientWithAssociations: IngredientWithAssociations = {
      ...ingredient,
      info: null,
      prices: null,
    };

    // add info
    ingredientWithAssociations["info"] = await IngredientInfoModel.findOne(
      "ingredientId",
      "==",
      id
    );

    // add prices
    const prices = await IngredientPriceModel.findWhere(
      "ingredientId",
      "==",
      id
    );
    const pricesWithSupplier = prices.map(async (price) => {
      const supplierEntity = new SupplierEntity();
      const supplier = await supplierEntity.findById(price.supplierId);

      return {
        ...price,
        supplier,
      };
    });

    ingredientWithAssociations["prices"] = await Promise.all(
      pricesWithSupplier
    );

    return ingredientWithAssociations;
  }

  async addInfo(info: IngredientInfo): Promise<IngredientInfo> {
    return await IngredientInfoModel.add(info);
  }

  async updateInfo(infoId: string, info: IngredientInfo) {
    return await IngredientInfoModel.update(infoId, info);
  }

  async findInfo(ingredientId: string) {
    return await IngredientInfoModel.findById(ingredientId);
  }

  /**
   * Find all prices for the ingredient
   *
   * @param ingredientId  The ingredient id
   * @returns  {IngredientPrice[]} All prices for the ingredient
   */
  async findAllPrices(ingredientId: string) {
    return await IngredientPriceModel.findWhere(
      "ingredientId",
      "==",
      ingredientId
    );
  }

  /**
   * Find prices that match the conditions
   *
   * @param conditions  { field: string, operator: string, value: any }[]
   * @returns {IngredientPrice[]} All prices that match the conditions
   */
  async findPrices(conditions: whereCompoundConditions) {
    return await IngredientPriceModel.whereCompound(conditions);
  }

  async addPrice(price: IngredientPrice): Promise<IngredientPrice> {
    return await IngredientPriceModel.add(price);
  }

  async updatePrice(priceId: string, price: IngredientPrice) {
    return await IngredientPriceModel.update(priceId, price);
  }

  async deletePrice(priceId: string) {
    return await IngredientPriceModel.delete(priceId);
  }

  validate(ingredient: Ingredient) {
    if (!ingredient.name) {
      serverError("O nome do ingrediente é obrigatório");
    }
  }
}
