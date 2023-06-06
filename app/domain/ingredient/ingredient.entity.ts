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

export interface IngredientWithAssociations extends Ingredient {
  info: IngredientInfo | null;
  prices: IngredientPrice[] | null;
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

    console.log(ingredient);

    if (!ingredient) {
      return null;
    }

    if (options.includeAssociations === false) {
      return ingredient;
    }

    const productWithAssociations: IngredientWithAssociations = {
      ...ingredient,
      info: null,
      prices: null,
    };
    productWithAssociations["info"] = await IngredientInfoModel.findOne(
      "productId",
      "==",
      id
    );
    productWithAssociations["prices"] = await IngredientPriceModel.findAll();

    return productWithAssociations;
  }

  async addInfo(info: IngredientInfo): Promise<IngredientInfo> {
    return await IngredientInfoModel.add(info);
  }

  async updateInfo(infoId: string, info: IngredientInfo) {
    return await IngredientInfoModel.update(infoId, info);
  }

  async getIngredientInfo(id: string) {
    return await IngredientInfoModel.findById(id);
  }

  async getIngredientPrices(id: string) {
    return await IngredientPriceModel.findAll();
  }

  async addPrice(price: IngredientPrice): Promise<IngredientPrice> {
    return await IngredientPriceModel.add(price);
  }

  async updatePrice(priceId: string, price: IngredientPrice) {
    return await IngredientPriceModel.update(priceId, price);
  }

  validate(ingredient: Ingredient) {
    if (!ingredient.name) {
      serverError("O nome do ingrediente é obrigatório");
    }
  }
}
