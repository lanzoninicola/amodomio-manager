import { badRequest, serverError } from "~/utils/http-response.server";
import type {
  Catalog,
  PizzaCatalog,
  PizzaCatalogItem,
} from "../catalog/catalog.model.server";
import { CatalogModel } from "../catalog/catalog.model.server";
import { CatalogEntity } from "../catalog/catalog.entity.server";
import type { LatestSellPrice } from "../sell-price/sell-price.model.server";
import type { CategoryMenu } from "../category/category.model.server";
import type {
  ProductMenu,
  ProductPricing,
} from "../product/product.model.server";
import type { PizzaSizeVariation, Topping } from "../pizza/pizza.entity.server";

class PizzaCatalogEntity extends CatalogEntity {
  async bindSizeToProductCatalog(
    catalogId: string,
    productId: string,
    size: PizzaSizeVariation
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
        sizes.push(size);

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
    topping: Topping,
    category: CategoryMenu,
    sellPrice: LatestSellPrice
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

      const sizes: PizzaSizeVariation[] = item.product.sizes || [];

      const updatedSizes = sizes.map((size) => {
        if (size.id !== sizeId) {
          return size;
        }

        const toppings: Topping[] = size.toppings || [];
        // // topping is also a Product //
        // topping["menu"] = {
        //   ...(topping["menu"] as ProductMenu),
        //   category: category,
        // };
        // topping["pricing"] = {
        //   ...(topping["pricing"] as ProductPricing),
        //   latestSellPrice: sellPrice,
        // };
        toppings.push(topping);

        size["toppings"] = toppings;

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
        const sizes: PizzaSizeVariation[] = item.product.sizes || [];
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
        const sizes: PizzaSizeVariation[] = item.product.sizes || [];
        const updatedSizes = sizes.map((size) => {
          if (size.id === sizeId) {
            const toppings: Topping[] = size.toppings || [];
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

  validate(catalog: Catalog): void {
    if (!catalog.name) {
      serverError("O nome do catálogo é obrigatório");
    }
  }
}

const pizzaCatalogEntity = new PizzaCatalogEntity(CatalogModel);

export { pizzaCatalogEntity };
