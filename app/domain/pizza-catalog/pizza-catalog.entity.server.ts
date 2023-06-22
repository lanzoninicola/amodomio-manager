import { badRequest, serverError } from "~/utils/http-response.server";
import { CatalogModel } from "../catalog/catalog.model.server";
import type { Catalog, CatalogItem } from "../catalog/catalog.model.server";
import { CatalogEntity } from "../catalog/catalog.entity.server";
import type { CategoryMenu } from "../category/category.model.server";
import type { Pizza, Topping } from "../pizza/pizza.entity.server";
import type { Size } from "../size/size.model.server";
import { ProductEntity } from "../product/product.entity";
import { categoryEntity } from "../category/category.entity.server";
import { sizeEntity } from "../size/size.entity.server";
import type { whereCompoundConditions } from "~/lib/firestore-model/src";

// PIZZA CATALOG //
export type PizzaCatalog = Omit<Catalog, "items"> & {
  type: "pizza";
  // array of Product with the pizza attributes (sizes, toppings)
  items?: PizzaCatalogItem[];
};

export interface PizzaCatalogItem extends CatalogItem {
  product: {
    id: Pizza["id"];
    sizes: PizzaSizeVariationsCatalog[];
  };
}

export interface PizzaSizeVariationsCatalog {
  id: Size["id"];
  toppings: PizzaToppingCatalog[];
}

export interface PizzaToppingCatalog {
  id: Topping["id"];
  category: {
    id: CategoryMenu["id"];
  };
  unitPrice: number;
  unitPromotionalPrice: number;
}

class PizzaCatalogEntity extends CatalogEntity {
  override async findAll(
    conditions?: whereCompoundConditions | undefined
  ): Promise<PizzaCatalog[]> {
    const pizzaCatalogs = await super.findAll([
      {
        field: "type",
        op: "==",
        value: "pizza",
      },
      ...(conditions || []),
    ]);

    return pizzaCatalogs as PizzaCatalog[];
  }

  async getAllProductsFromAllCatalogs() {
    const catalogs = await this.findAll();

    const pizzaCatalogsWithProducts = catalogs.map(async (catalog) => {
      if (!catalog) return null;
      if (!catalog.id) return null;

      const products = await this.getAllProducts(catalog.id);

      return {
        catalogId: catalog.id,
        products,
      };
    });

    return Promise.all(pizzaCatalogsWithProducts);
  }

  async getAllProducts(catalogId: string) {
    const productEntity = new ProductEntity();
    const products = await productEntity.findAll();
    const categories = await categoryEntity.findAll();
    const sizes = await sizeEntity.findAll();

    const catalog = (await pizzaCatalogEntity.findOne([
      {
        field: "type",
        op: "==",
        value: "pizza",
      },
    ])) as PizzaCatalog;

    if (!catalog) {
      return [];
    }

    if (!catalog.items) {
      return [];
    }

    let pizzaCatalog: PizzaCatalogItem[] = [];

    console.log(catalog.items);

    pizzaCatalog = catalog.items.map((item) => {
      return {
        ...item.product,
        product: {
          ...products.find((p) => p.id === item.product.id),
          sizes: item.product.sizes.map((s) => {
            return {
              ...s,
              ...sizes.find((size) => size.id === s.id),
              toppings: s.toppings.map((topping) => {
                return {
                  ...topping,
                  ...products.find((p) => p.id === topping.id),
                  category: {
                    ...(categories.find(
                      (c) => c.id === topping.id
                    ) as CategoryMenu),
                  },
                };
              }),
            };
          }),
        },
      };
    });

    return pizzaCatalog;
  }

  async bindSizeToProductCatalog(
    catalogId: string,
    productId: string,
    sizeId: string
  ) {
    const catalog = (await this.findById(catalogId)) as PizzaCatalog;

    if (!catalog) {
      return badRequest("Catálogo não encontrado");
    }

    const items = catalog.items || [];

    const pizzaCatalogItems = items as PizzaCatalogItem[];

    const updatedPizzaItem = pizzaCatalogItems.map((item) => {
      if (item.product.id === productId) {
        const sizes = item.product.sizes || [];

        const newSize: PizzaSizeVariationsCatalog = {
          id: sizeId,
          toppings: [],
        };

        sizes.push(newSize);

        item.product.sizes = sizes;
      }

      return item;
    });

    return await this.update(catalogId, {
      items: updatedPizzaItem,
    });
  }

  async addToppingToCatalog(
    catalogId: string,
    productId: string,
    sizeId: string,
    toppingCatalog: PizzaToppingCatalog
  ) {
    const catalog = (await this.findById(catalogId)) as PizzaCatalog;

    if (!catalog) {
      return badRequest("Catálogo não encontrado");
    }

    const items = catalog.items || [];
    const pizzaCatalogItems = items as PizzaCatalogItem[];

    if (items.length === 0) {
      const newPizzaCatalogItem: PizzaCatalogItem = {
        catalogId: catalogId,
        product: {
          id: productId,
          sizes: [
            {
              id: sizeId,
              toppings: [toppingCatalog],
            },
          ],
        },
      };

      pizzaCatalogItems.push(newPizzaCatalogItem);

      console.log(pizzaCatalogItems);

      return await this.update(catalogId, {
        items: pizzaCatalogItems,
      });
    }

    const updatedPizzaItem = pizzaCatalogItems.map((item) => {
      item.catalogId = catalogId;
      item.product.id = productId;
      const sizes: PizzaSizeVariationsCatalog[] = item.product.sizes || [];

      const updatedSizes = sizes.map((size) => {
        const toppingExists = size.toppings?.some(
          (topping) => topping.id === toppingCatalog.id
        );

        if (toppingExists) {
          return size;
        }

        const toppings: PizzaToppingCatalog[] = size.toppings || [];

        const newTopping: PizzaToppingCatalog = {
          id: toppingCatalog.id,
          category: {
            id: toppingCatalog.category.id,
          },
          unitPrice: toppingCatalog.unitPrice,
          unitPromotionalPrice: toppingCatalog.unitPromotionalPrice,
        };

        toppings.push(newTopping);

        size["toppings"] = toppings;

        return size;
      });

      item.product.sizes = updatedSizes;

      return item;
    });

    console.log(updatedPizzaItem);

    return await this.update(catalogId, {
      items: updatedPizzaItem,
    });
  }

  async updateToppingFromCatalog(
    catalogId: string,
    productId: string,
    sizeId: string,
    toppingCatalog: PizzaToppingCatalog
  ) {
    const catalog = (await this.findById(catalogId)) as PizzaCatalog;

    if (!catalog) {
      return badRequest("Catálogo não encontrado");
    }

    const items = catalog.items || [];

    const pizzaCatalogItems = items as PizzaCatalogItem[];

    const updatedPizzaItem = pizzaCatalogItems.map((item) => {
      if (item.product.id !== productId) {
        return item;
      }

      const sizes: PizzaSizeVariationsCatalog[] = item.product.sizes || [];

      const updatedSizes = sizes.map((size) => {
        if (size.id !== sizeId) {
          return size;
        }

        const toppings: PizzaToppingCatalog[] = size.toppings || [];

        const updatedToppings = toppings.map((topping) => {
          if (topping.id !== toppingCatalog.id) {
            return topping;
          }

          topping.categoryId = toppingCatalog.categoryId;
          topping.unitPrice = toppingCatalog.unitPrice;
          topping.unitPromotionalPrice = toppingCatalog.unitPromotionalPrice;
          return topping;
        });

        size.toppings = updatedToppings;
        return size;
      });

      item.product.sizes = updatedSizes;
      return item;
    });

    return await this.update(catalogId, {
      items: updatedPizzaItem,
    });
  }

  async removeSizeFromProductCatalog(
    catalogId: string,
    productId: string,
    sizeId: string
  ) {
    const catalog = (await this.findById(catalogId)) as PizzaCatalog;

    if (!catalog) {
      return badRequest("Catálogo não encontrado");
    }

    const items = catalog.items || [];

    const pizzaCatalogItems = items as PizzaCatalogItem[];

    const updatedPizzaItem = pizzaCatalogItems.map((item) => {
      if (item.product.id === productId) {
        const sizes: PizzaSizeVariationsCatalog[] = item.product.sizes || [];
        const updatedSizes = sizes.filter((size) => size.id !== sizeId);
        item.product.sizes = updatedSizes;
      }

      return item;
    });

    return await this.update(catalogId, {
      items: updatedPizzaItem,
    });
  }

  async removeToppingFromSize(
    catalogId: string,
    productId: string,
    sizeId: string,
    toppingId: string
  ) {
    const catalog = (await this.findById(catalogId)) as PizzaCatalog;

    if (!catalog) {
      return badRequest("Catálogo não encontrado");
    }

    const items = catalog.items || [];

    const pizzaCatalogItems = items as PizzaCatalogItem[];

    const updatedPizzaItem = pizzaCatalogItems.map((item) => {
      if (item.product.id === productId) {
        const sizes: PizzaSizeVariationsCatalog[] = item.product.sizes || [];
        const updatedSizes = sizes.map((size) => {
          if (size.id === sizeId) {
            const toppings: PizzaToppingCatalog[] = size.toppings || [];
            const updatedToppings = toppings.filter(
              (topping) => topping.id !== toppingId
            );

            size["toppings"] = updatedToppings;
          }

          return size;
        });

        item.product.sizes = updatedSizes;
      }

      return item;
    });

    return await this.update(catalogId, {
      items: updatedPizzaItem,
    });
  }

  async getToppingsFromCatalog(
    catalogId: string,
    productId: string,
    sizeId: string
  ) {
    const catalog = (await this.findById(catalogId)) as PizzaCatalog;

    if (!catalog) {
      return badRequest("Catálogo não encontrado");
    }

    const items = catalog.items || [];

    const pizzaCatalogItems = items as PizzaCatalogItem[];

    const result: PizzaToppingCatalog[] = [];

    pizzaCatalogItems.forEach((item) => {
      if (item.product.id === productId) {
        const sizes: PizzaSizeVariationsCatalog[] = item.product.sizes || [];
        const size = sizes.find((size) => size.id === sizeId);

        if (size) {
          const toppings: PizzaToppingCatalog[] = size.toppings || [];
          result.push(...toppings);
        }
      }
    });

    return result;
  }

  validate(catalog: Catalog): void {
    if (!catalog.name) {
      serverError("O nome do catálogo é obrigatório");
    }
  }
}

const pizzaCatalogEntity = new PizzaCatalogEntity(CatalogModel);

export { pizzaCatalogEntity };
