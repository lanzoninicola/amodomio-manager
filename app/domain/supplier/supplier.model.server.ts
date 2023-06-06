import { createFirestoreModel } from "~/lib/firestore-model/src";

interface Supplier {
  id?: string;
  name: string;
  phoneNumber: string;
  email: string;
  contactName: string;
}

const SupplierModel = createFirestoreModel<Supplier>("suppliers");

export { SupplierModel, type Supplier };
