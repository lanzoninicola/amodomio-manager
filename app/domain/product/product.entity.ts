import { serverError } from "~/utils/http-response.server";
import type { Product, ProductComponent } from "./product.model.server";
import { ProductModel } from "./product.model.server";
import type { whereCompoundConditions } from "~/lib/firestore-model/src";

export class ProductEntity {
  async create(product: Product): Promise<Product> {
    this.validate(product);
    return this.save(product);
  }

  private async save(product: Product): Promise<Product> {
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

  async addComponent(productId: string, component: ProductComponent) {
    const product = await this.findById(productId);
    const components = product?.components || [];
    components.push(component);

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

  // async updateComponentInComposition(id: string, element: ProductComposition) {
  //   return await ProductCompositionModel.update(id, element);
  // }

  // async removeComponentFromComposition(id: string) {
  //   return await ProductCompositionModel.delete(id);
  // }

  // async findAllComponentsOfComposition(
  //   productId: string,
  //   options = {
  //     includeAssociations: true,
  //   }
  // ): Promise<
  //   ProductComposition[]
  // > {
  //   const components = await ProductCompositionModel.whereCompound([
  //     {
  //       field: "productId",
  //       op: "==",
  //       value: productId,
  //     },
  //   ]);

  //   if (options.includeAssociations === false) {
  //     return components;
  //   }

  //   const promises = components.map(async (component) => {
  //     const componentsWithAssociation: ProductCompositionWithAssociations = {
  //       ...component,
  //       product: null,
  //       ingredient: null,
  //     };

  //     if (component.componentType === "product") {
  //       componentsWithAssociation["product"] = await ProductModel.findById(
  //         component.componentId
  //       );
  //     }

  //     if (component.componentType === "ingredient") {
  //       componentsWithAssociation["ingredient"] =
  //         await IngredientModel.findById(component.componentId);
  //     }

  //     return componentsWithAssociation;
  //   });

  //   const componentsWithAssociations = await Promise.all(promises);

  //   return componentsWithAssociations;

  //   // const promises = components.map((component) => {
  //   //   console.log(component.componentId);

  //   //   const foo = IngredientModel.findById(component.componentId);

  //   //   console.log(foo);
  //   //   return foo;
  //   // });

  //   // const componentsWithAssociations = await Promise.all(promises);

  //   // console.log(
  //   //   "🚀 ~ file: product.entity.ts:221 ~ ProductEntity ~ componentsWithAssociations:",
  //   //   componentsWithAssociations
  //   // );

  //   // return componentsWithAssociations;
  // }

  validate(product: Product) {
    if (!product.name) {
      serverError("O nome do produto é obrigatório", { throwIt: true });
    }
  }
}
