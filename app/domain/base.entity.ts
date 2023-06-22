import type { whereCompoundConditions } from "~/lib/firestore-model/src";
import type { FirestoreModel } from "~/lib/firestore-model/src/lib/firestore-model.server";

export class BaseEntity<T> {
  protected model: FirestoreModel<T>;

  constructor(model: FirestoreModel<T>) {
    this.model = model;
  }

  async create(record: T): Promise<T> {
    this.validate(record);
    return this.save(record);
  }

  protected async save(record: T): Promise<T> {
    return await this.model.add(record as { [key: string]: any });
  }

  async findAll(conditions?: whereCompoundConditions): Promise<T[]> {
    if (!conditions) {
      return await this.model.findAll();
    }

    return await this.model.whereCompound(conditions);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async findOne(conditions: whereCompoundConditions): Promise<T | null> {
    return await this.model.findOne(conditions);
  }

  async update(id: string, updatedData: any) {
    return await this.model.update(id, updatedData);
  }

  async delete(id: string) {
    return await this.model.delete(id);
  }

  async getLatest() {
    return await this.model.getLatest();
  }

  protected validate(record: T) {}
}
