import { createFirestoreModel } from "~/lib/firestore-model/src";

interface User {
  id?: string;
  name: string;
  phoneNumber: string;
  email: string;
  contactName: string;
}

const UserModel = createFirestoreModel<User>("users");

export { UserModel, type User };
