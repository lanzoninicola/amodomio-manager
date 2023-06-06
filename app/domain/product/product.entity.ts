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

export interface ProductWithAssociations extends Product {
  info: ProductInfo | null;
  composition: ProductComposition | null;
  menu: ProductMenu | null;
}

export class ProductEntity {
  async findAll(): Promise<Product[]> {
    return await ProductModel.findAll();
  }

  async findById(
    id: string,
    options = {
      includeAssociations: true,
    }
  ): Promise<Product | ProductWithAssociations | null> {
    let product = await ProductModel.findById(id);

    console.log(product);

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
}
