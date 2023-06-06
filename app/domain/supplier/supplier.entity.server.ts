import { serverError } from "~/utils/http-response.server";
import type { Supplier } from "./supplier.model.server";
import { SupplierModel } from "./supplier.model.server";

export class SupplierEntity {
  async findAll(): Promise<Supplier[]> {
    return await SupplierModel.findAll();
  }

  async findById(id: string): Promise<Supplier | null> {
    return await SupplierModel.findById(id);
  }

  async create(supplier: Supplier): Promise<Supplier> {
    this.validate(supplier);
    return this.save(supplier);
  }

  private async save(supplier: Supplier): Promise<Supplier> {
    return await SupplierModel.add(supplier);
  }

  async update(id: string, supplier: Supplier) {
    this.validate(supplier);
    return await SupplierModel.update(id, supplier);
  }

  async delete(id: string): Promise<void> {
    await SupplierModel.delete(id);
  }

  private validate(supplier: Supplier): void {
    if (!supplier.name) {
      serverError("O nome do fornecedor é obrigatório");
    }
  }
}
