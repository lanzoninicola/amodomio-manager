import { serverError } from "~/utils/http-response.server";
import type { User } from "./user.model.server";
import { UserModel } from "./user.model.server";
import type { whereCompoundCondition } from "~/lib/firestore-model/src";

export class UserEntity {
  async findAll(): Promise<User[]> {
    return await UserModel.findAll();
  }

  async findById(id: string): Promise<User | null> {
    return await UserModel.findById(id);
  }

  async findOne({
    field,
    op,
    value,
  }: whereCompoundCondition): Promise<User | null> {
    return await UserModel.findOne(field, op, value);
  }

  async create(category: User): Promise<User> {
    this.validate(category);
    return this.save(category);
  }

  private async save(category: User): Promise<User> {
    return await UserModel.add(category);
  }

  async update(id: string, category: User) {
    this.validate(category);
    return await UserModel.update(id, category);
  }

  async delete(id: string): Promise<void> {
    // add control that checks if there are products associated with the category

    await UserModel.delete(id);
  }

  private validate(category: User): void {
    if (!category.name) {
      serverError("O nome do fornecedor é obrigatório");
    }
  }
}
