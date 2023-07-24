import { createFirestoreModel } from "~/lib/firestore-model/src";

export interface Option {
  id?: string;
  name: string;
  type?: "boolean" | "string" | "number" | "array" | "object";
  value: string;
}

const OptionModel = createFirestoreModel<Option>("options");

export { OptionModel };
