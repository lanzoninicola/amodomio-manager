import { badRequest, serverError } from "~/utils/http-response.server";
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
import isNumber from "~/utils/is-number";

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

  async addPrice(ingredientPrice: IngredientPrice): Promise<IngredientPrice> {
    await this.validatePriceMutation(ingredientPrice);

    return await IngredientPriceModel.add(ingredientPrice);
  }

  async updatePrice(priceId: string, ingredientPrice: IngredientPrice) {
    await this.validatePriceMutation(ingredientPrice);

    if (!priceId) {
      return badRequest({
        action: "ingredient-update-price",
        message: "Não foi possivel identificar o registro da atualizar",
      });
    }

    return await IngredientPriceModel.update(priceId, ingredientPrice);
  }

  async deletePrice(priceId: string) {
    return await IngredientPriceModel.delete(priceId);
  }

  validate(ingredient: Ingredient) {
    if (!ingredient.name) {
      serverError("O nome do ingrediente é obrigatório");
    }
  }

  async validatePriceMutation(ingredientPrice: IngredientPrice) {
    console.log(
      { ingredientPrice },
      isNumber(ingredientPrice.quantity),
      ingredientPrice.quantity
    );

    if (isNumber(ingredientPrice.price) === false) {
      return badRequest({
        message: "O preço do ingrediente deve ser um número",
      });
    }

    if (isNumber(ingredientPrice.quantity) === false) {
      return badRequest({ message: "A quantitade deve ser um número" });
    }

    if (ingredientPrice.price === 0 || ingredientPrice.price === null) {
      serverError({
        message: "O preço do ingrediente não pode ser zero",
      });
    }

    if (ingredientPrice.quantity === 0) {
      return badRequest({
        message: "A quantidade do ingrediente não pode ser zero",
      });
    }

    const defaultPriceExists = (await this.findPrices([
      { field: "ingredientId", op: "==", value: ingredientPrice.ingredientId },
      { field: "defaultPrice", op: "==", value: true },
    ])) as IngredientPrice[];

    if (defaultPriceExists.length >= 1) {
      return badRequest({
        action: "ingredient-update-price",
        message: "Já existe um preço padrão para este ingrediente",
      });
    }
  }
}
