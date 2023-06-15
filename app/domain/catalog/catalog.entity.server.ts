import { badRequest, serverError } from "~/utils/http-response.server";
import type { Catalog, CatalogType } from "./catalog.model.server";
import { CatalogModel } from "./catalog.model.server";
import { BaseEntity } from "../base.entity";
import type { Product } from "../product/product.model.server";

export class CatalogEntity extends BaseEntity<Catalog> {
  getCatalogTypes(): CatalogType[] {
    return ["pizza", "drinks", "combo", "promo"];
  }

  override async delete(id: string) {
    // TODO: check if catalog is being used in an order

    return await CatalogModel.delete(id);
  }

  async addProductToCatalog(catalogId: string, productId: string) {
    const catalog = await this.findById(catalogId);
    const items = catalog?.items || [];

    const updatedItems = [
      ...items,
      {
        parentId: catalogId,
        product: {
          id: productId,
        },
      },
    ];

    return await this.update(catalogId, {
      items: updatedItems,
    });
  }

  async removeProductFromCatalog(catalogId: string, productId: string) {
    const catalog = await this.findById(catalogId);

    if (!catalog) {
      return badRequest("Catálogo não encontrado");
    }

    const items = catalog.items || [];

    const updatedItems = items.filter((item) => item.product.id !== productId);

    return await this.update(catalogId, {
      items: updatedItems,
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
