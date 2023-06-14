import { createFirestoreModel } from "~/lib/firestore-model/src";

interface Size {
  id?: string;
  name: string;
  slices: number;
  maxToppingsAmount: number;
  factorSize: number;
  factorToppingsAmount: number;
}

const SizeModel = createFirestoreModel<Size>("sizes");

export { SizeModel, type Size };
