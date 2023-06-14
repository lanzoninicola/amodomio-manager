import { serverError } from "~/utils/http-response.server";
import type { Size } from "./size.model.server";
import { SizeModel } from "./size.model.server";

export class SizeEntity {
  async findAll(): Promise<Size[]> {
    return await SizeModel.findAll();
  }

  async findById(id: string): Promise<Size | null> {
    return await SizeModel.findById(id);
  }

  async create(size: Size): Promise<Size> {
    this.validate(size);
    return this.save(size);
  }

  private async save(size: Size): Promise<Size> {
    return await SizeModel.add(size);
  }

  async update(id: string, size: Size) {
    this.validate(size);
    return await SizeModel.update(id, size);
  }

  async delete(id: string): Promise<void> {
    await SizeModel.delete(id);
  }

  private validate(size: Size): void {
    if (!size.name) {
      serverError("O nome do tamanho é obrigatório");
    }
  }
}
