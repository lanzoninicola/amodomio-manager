import { serverError } from "~/utils/http-response.server";
import type {
  Product,
  ProductComponent,
  ProductInfo,
  ProductType,
} from "./product.model.server";
import { ProductModel } from "./product.model.server";
import type { whereCompoundConditions } from "~/lib/firestore-model/src";
import type { LatestSellPrice } from "../sell-price/sell-price.model.server";

export interface ProductTypeHTMLSelectOption {
  value: ProductType;
  label: string;
}

export class ProductEntity {
  async create(product: Product): Promise<Product> {
    this.validate(product);
    return this.save(product);
  }

  private async save(product: Product): Promise<Product> {
    console.log(product);

    return await ProductModel.add(product);
  }

  async findAll(conditions?: whereCompoundConditions): Promise<Product[]> {
    if (!conditions) {
      return await ProductModel.findAll();
    }

    return await ProductModel.whereCompound(conditions);
  }

  async findById(id: string): Promise<Product | null> {
    return await ProductModel.findById(id);
  }

  async update(id: string, updatedData: any) {
    return await ProductModel.update(id, updatedData);
  }

  async delete(id: string) {
    // TODO: check if product is being used in a catalog
    // TODO: check if product is a topping or pizza product
    // TODO: check if product is a component of another product
    // TODO: check if product is inside an order

    return await ProductModel.delete(id);
  }

  async addComponent(productId: string, component: ProductComponent) {
    const product = await this.findById(productId);
    const components = product?.components || [];

    const componentExists = components.some(
      (c) => c.product.id === component.product.id
    );

    if (componentExists === false) {
      components.push(component);
    }

    return await this.update(productId, {
      components: components,
    });
  }

  async updateComponent(
    productId: string,
    componentId: string,
    updatedData: any
  ) {
    const product = await this.findById(productId);
    const components = product?.components || [];

    const updatedComponents = components.map((component) => {
      if (component.product.id === componentId) {
        return {
          ...component,
          ...updatedData,
        };
      }

      return component;
    });

    return await this.update(productId, {
      components: updatedComponents,
    });
  }

  async removeComponent(productId: string, componentId: string) {
    const product = await this.findById(productId);
    const components = product?.components || [];

    const updatedComponents = components.filter(
      (component) => component.product.id !== componentId
    );

    return await this.update(productId, {
      components: updatedComponents,
    });
  }

  async getSellingPrice(productId: string): Promise<LatestSellPrice> {
    const product = await this.findById(productId);

    if (!product) {
      return {
        unitPrice: 0,
        unitPromotionalPrice: 0,
      };
    }

    const productType = product?.info?.type;

    if (!productType) {
      return {
        unitPrice: 0,
        unitPromotionalPrice: 0,
      };
    }

    return (
      product.pricing?.latestSellPrice || {
        unitPrice: 0,
        unitPromotionalPrice: 0,
      }
    );
  }

  static getProductTypeValues(type: ProductInfo["type"] | null | undefined) {
    switch (type) {
      case "pizza":
        return "Pizza";
      case "ingredient":
        return "Ingrediente";
      case "topping":
        return "Sabor";
      case "prepared":
        return "Preparado";
      case "simple":
        return "Simples";
      case null:
      case undefined:
        return "Não definido";
      default:
        return "Não definido";
    }
  }

  static getProductTypeRawValues(): ProductTypeHTMLSelectOption[] {
    return [
      { value: "pizza", label: "Pizza" },
      { value: "ingredient", label: "Ingrediente" },
      { value: "topping", label: "Sabor" },
      { value: "prepared", label: "Preparado" },
      { value: "simple", label: "Simples" },
    ];
  }

  validate(product: Product) {
    if (!product.name) {
      serverError("O nome do produto é obrigatório", { throwIt: true });
    }
  }
}
