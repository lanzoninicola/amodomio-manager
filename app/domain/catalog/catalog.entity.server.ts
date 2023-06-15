import { serverError } from "~/utils/http-response.server";
import type {
  Catalog,
  CatalogItem,
  CatalogType,
  PizzasCatalogItem,
} from "./catalog.model.server";
import { CatalogModel } from "./catalog.model.server";
import { BaseEntity } from "../base.entity";

class CatalogEntity extends BaseEntity<Catalog> {
  getCatalogTypes(): CatalogType[] {
    return ["pizza", "drinks", "combo", "promo"];
  }

  override async delete(id: string) {
    // TODO: check if catalog is being used in an order

    return await CatalogModel.delete(id);
  }

  async addProductToCatalog(
    catalogId: string,
    item: CatalogItem | PizzasCatalogItem
  ) {
    const catalog = await this.findById(catalogId);
    const items = catalog?.items || [];
    items.push(item);

    return await this.update(catalogId, {
      items: items,
    });
  }

  async updateProductOnPizzaCatalog(
    catalogId: string,
    updatedData: PizzasCatalogItem
  ) {
    const catalog = await this.findById(catalogId);
    const items = catalog?.items || [];

    const pizzaCatalogItems = items as PizzasCatalogItem[];
    const pizzaCatalogUpdatedItem = updatedData as PizzasCatalogItem;

    const updatedPizzaItem = pizzaCatalogItems.map((item) => {
      if (
        item.product.id === pizzaCatalogUpdatedItem.product.id &&
        item.topping.id === pizzaCatalogUpdatedItem.topping.id
      ) {
        return {
          ...item,
          ...updatedData,
        };
      }

      return item;
    });

    return await this.update(catalogId, {
      items: updatedPizzaItem,
    });
  }

  async updateProductCatalog(catalogId: string, updatedData: CatalogItem) {
    const catalog = await this.findById(catalogId);
    const items = catalog?.items || [];

    const catalogItems = items as CatalogItem[];

    const updatedCatalogItem = catalogItems.map((item) => {
      if (item.product.id === updatedData.product.id) {
        return {
          ...item,
          ...updatedData,
        };
      }

      return item;
    });

    return await this.update(catalogId, {
      items: updatedCatalogItem,
    });
  }
  validate(catalog: Catalog): void {
    if (!catalog.name) {
      serverError("O nome do catálogo é obrigatório");
    }
  }
}

const catalogEntity = new CatalogEntity(CatalogModel);

export { catalogEntity };
