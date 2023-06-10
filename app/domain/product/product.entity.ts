import { serverError } from "~/utils/http-response.server";
import {
  type ProductComposition,
  ProductCompositionModel,
} from "./product-composition.model.server";
import {
  type ProductInfo,
  ProductInfoModel,
} from "./product-info.model.server";
import type { ProductMenu } from "./product-menu.model.server";
import { ProductMenuModel } from "./product-menu.model.server";
import type { Product } from "./product.model.server";
import { ProductModel } from "./product.model.server";
import type { whereCompoundConditions } from "~/lib/firestore-model/src";
import {
  IngredientModel,
  type Ingredient,
} from "../ingredient/ingredient.model.server";
import { IngredientPriceModel } from "../ingredient/ingredient-price.model.server";

export interface ProductWithAssociations extends Product {
  info: ProductInfo | null;
  composition: ProductComposition | null;
  menu: ProductMenu | null;
}

type IngredientWithUnitCost = Ingredient & {
  unitCost: number;
};

type ProductWithUnitCost = Product & {
  unitCost: number;
};

export interface ProductCompositionWithAssociations extends ProductComposition {
  product: ProductWithUnitCost | null;
  ingredient: IngredientWithUnitCost | null;
}

export class ProductEntity {
  async create(product: Product): Promise<Product> {
    this.validate(product);
    return this.save(product);
  }

  private async save(product: Product): Promise<Product> {
    return await ProductModel.add(product);
  }

  async findAll(
    conditions?: whereCompoundConditions,
    options = {
      includeAssociations: true,
    }
  ): Promise<Product[] | ProductWithAssociations[] | []> {
    let query;
    if (conditions) {
      query = ProductModel.whereCompound(conditions);
    } else {
      query = ProductModel.findAll();
    }

    if (options.includeAssociations === false) {
      return await query;
    }

    const products = await query;

    if (products.length) {
      const productsWithAssociations: ProductWithAssociations[] = [];

      for (const product of products) {
        const productWithAssociations: ProductWithAssociations = {
          ...product,
          info: null,
          composition: null,
          menu: null,
        };
        productWithAssociations["info"] = await ProductInfoModel.findOne(
          "productId",
          "==",
          product.id
        );
        productWithAssociations["composition"] =
          await ProductCompositionModel.findOne("productId", "==", product.id);
        productWithAssociations["menu"] = await ProductMenuModel.findOne(
          "productId",
          "==",
          product.id
        );

        productsWithAssociations.push(productWithAssociations);
      }

      return productsWithAssociations;
    }

    return [];
  }

  async findById(
    id: string,
    options = {
      includeAssociations: true,
    }
  ): Promise<Product | ProductWithAssociations | null> {
    let product = await ProductModel.findById(id);

    if (!product) {
      return null;
    }

    if (options.includeAssociations === false) {
      return product;
    }

    const productWithAssociations: ProductWithAssociations = {
      ...product,
      info: null,
      composition: null,
      menu: null,
    };
    productWithAssociations["info"] = await ProductInfoModel.findOne(
      "productId",
      "==",
      id
    );
    productWithAssociations["composition"] =
      await ProductCompositionModel.findOne("productId", "==", id);

    productWithAssociations["menu"] = await ProductMenuModel.findOne(
      "productId",
      "==",
      id
    );

    return productWithAssociations;
  }

  async getProductInfo(id: string) {
    return await ProductInfoModel.findById(id);
  }

  async addComponentToComposition(
    element:
      | ProductComposition
      | Omit<
          ProductComposition,
          "unit" | "quantity" | "unitCost" | "costAmount"
        >
  ) {
    return await ProductCompositionModel.add(element);
  }

  async updateComponentInComposition(id: string, element: ProductComposition) {
    return await ProductCompositionModel.update(id, element);
  }

  async removeComponentFromComposition(id: string) {
    return await ProductCompositionModel.delete(id);
  }

  async findAllComponentsOfComposition(
    productId: string,
    options = {
      includeAssociations: true,
    }
  ): Promise<ProductComposition[] | ProductCompositionWithAssociations[]> {
    const components = await ProductCompositionModel.whereCompound([
      {
        field: "productId",
        op: "==",
        value: productId,
      },
    ]);

    if (options.includeAssociations === false) {
      return components;
    }

    const componentsWithAssociations = [];

    for (const component of components) {
      const componentsWithAssociation: ProductCompositionWithAssociations = {
        ...component,
        product: null,
        ingredient: null,
      };

      if (component.componentType === "product") {
        const product = await ProductModel.findById(component.componentId);
        if (product) {
          componentsWithAssociation["product"] = {
            ...product,
            unitCost: product.cost || 0,
          };
        }
      }

      if (component.componentType === "ingredient") {
        const ingredient = await IngredientModel.findById(
          component.componentId
        );
        const ingredientPrice = await IngredientPriceModel.whereCompound([
          {
            field: "ingredientId",
            op: "==",
            value: component.componentId,
          },
          {
            field: "defaultPrice",
            op: "==",
            value: true,
          },
        ]);
        if (ingredient) {
          componentsWithAssociation["ingredient"] = {
            ...ingredient,
            unitCost:
              ingredientPrice.length === 0 ? 0 : ingredientPrice[0].unitPrice,
          };
        }
      }

      componentsWithAssociations.push(componentsWithAssociation);
    }

    console.log(componentsWithAssociations);

    return componentsWithAssociations;
  }

  validate(product: Product) {
    if (!product.name) {
      serverError("O nome do produto é obrigatório", { throwIt: true });
    }
  }
}
