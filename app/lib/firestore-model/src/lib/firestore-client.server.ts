import type { Firestore } from "firebase/firestore";

export default class FirestoreClient {
  get connection() {
    return this._connection;
  }

  constructor(private _connection: Firestore) {}
}
