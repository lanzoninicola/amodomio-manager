import FirestoreClient from "./firestore-client.server";
import connection from "./firestore-connection.server";
import { FirestoreModel } from "./firestore-model.server";

/**
 * The Firestore model factory, which creates a Firestore model.
 * The shape of model object is determined by the interface given
 * to the generic type T when creating the model.
 *
 * @param collectionName  The name of the collection
 * @returns
 */
function createFirestoreModel<T>(collectionName: string): FirestoreModel<T> {
  const client = new FirestoreClient(connection);

  return new FirestoreModel<T>(client, collectionName);
}

export default createFirestoreModel;
