import { createFirestoreModel } from "~/lib/firestore-model/src";

interface Session {
  id?: string;
  data: any;
  expirationDate: Date;
}

const SessionModel = createFirestoreModel<Session>("sessions");

export { SessionModel, type Session };
