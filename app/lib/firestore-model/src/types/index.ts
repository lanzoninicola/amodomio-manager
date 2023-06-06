import { type FirestoreModel } from "../lib/firestore-model.server";

export type FirestoreDocumentId = string;
export type FirestoreDocument = { [key: string]: any };

export type FirestoreModelMutationData<T> = T & {
  createdAt: string;
  updatedAt: string;
};

// Type for the FirestoreModel class
export type TFirestoreModel<T> = FirestoreModel<T> &
  FirestoreModelMutationData<T>;
