import { BaseEntity } from "../base.entity";
import { OptionModel, type Option } from "./option.model.server";

class OptionEntity extends BaseEntity<Option> {
  override async create(record: Option): Promise<Option> {
    await this.validate(record);

    if (typeof record.value === "boolean") {
      record.value = record.value ? "true" : "false";
      record.type = "boolean";
    }

    if (Array.isArray(record.value)) {
      record.value = record.value.join(",");
      record.type = "array";
    }

    // if it is an object, we need to convert it to a string
    if (typeof record.value === "object") {
      record.value = JSON.stringify(record.value);
      record.type = "object";
    }

    record.type = record.type || "string";
    record.value = record.value || "";

    console.log(record);

    return await super.save(record);
  }
}

const optionEntity = new OptionEntity(OptionModel);

export { optionEntity };
