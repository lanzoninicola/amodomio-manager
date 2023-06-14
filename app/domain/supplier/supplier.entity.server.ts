import { serverError } from "~/utils/http-response.server";
import type { Supplier } from "./supplier.model.server";
import { SupplierModel } from "./supplier.model.server";
import { BaseEntity } from "../base.entity";
import type { CatalogType } from "../catalog/catalog.model.server";

class SupplierEntity extends BaseEntity<Supplier> {
  validate(supplier: Supplier): void {
    if (!supplier.name) {
      serverError("O nome do fornecedor é obrigatório");
    }
  }
}

const supplierEntity = new SupplierEntity(SupplierModel);

export { supplierEntity };
