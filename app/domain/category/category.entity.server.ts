import { serverError } from "~/utils/http-response.server";
import type { Category } from "./category.model.server";
import { CategoryModel } from "./category.model.server";
import { BaseEntity } from "../base.entity";

class CategoryEntity extends BaseEntity<Category> {
  override async delete(id: string) {
    // TODO: check if category is being used in a catalog

    return await CategoryModel.delete(id);
  }

  validate(category: Category): void {
    if (!category.name) {
      serverError("O nome do catálogo é obrigatório");
    }
  }
}

const categoryEntity = new CategoryEntity(CategoryModel);

export { categoryEntity };
