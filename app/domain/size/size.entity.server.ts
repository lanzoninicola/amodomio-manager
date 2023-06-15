import { serverError } from "~/utils/http-response.server";
import type { Size } from "./size.model.server";
import { SizeModel } from "./size.model.server";
import { BaseEntity } from "../base.entity";

export class CatalogEntity extends BaseEntity<Size> {
  override async delete(id: string) {
    // TODO: check if size is being used in a catalog

    return await SizeModel.delete(id);
  }

  validate(size: Size): void {
    if (!size.name) {
      serverError("O nome do catálogo é obrigatório");
    }
  }
}

const sizeEntity = new CatalogEntity(SizeModel);

export { sizeEntity };
