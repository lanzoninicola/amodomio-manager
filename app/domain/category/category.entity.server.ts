import { serverError } from "~/utils/http-response.server";
import type { Category } from "./category.model.server";
import { CategoryModel } from "./category.model.server";

export class CategoryEntity {
  async findAll(): Promise<Category[]> {
    return await CategoryModel.findAll();
  }

  async findById(id: string): Promise<Category | null> {
    return await CategoryModel.findById(id);
  }

  async create(category: Category): Promise<Category> {
    this.validate(category);
    return this.save(category);
  }

  private async save(category: Category): Promise<Category> {
    return await CategoryModel.add(category);
  }

  async update(id: string, category: Category) {
    this.validate(category);
    return await CategoryModel.update(id, category);
  }

  async delete(id: string): Promise<void> {
    // add control that checks if there are products associated with the category

    await CategoryModel.delete(id);
  }

  private validate(category: Category): void {
    if (!category.name) {
      serverError("O nome do fornecedor é obrigatório");
    }
  }
}
