import type { WhereFilterOp } from "firebase/firestore";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import type { FirestoreDocumentUpdateError } from "./firestore-errors.server";
import { FirestoreDocumentDeletionError } from "./firestore-errors.server";
import {
  FirestoreDocumentCreationError,
  FirestoreDocumentNotFound,
} from "./firestore-errors.server";
import type FirestoreClient from "./firestore-client.server";

import type { FirestoreDocument } from "../types";
import errorMessage from "../utils/error-message";

/**
 * @class FirestoreModel
 * @description A class that provides a base for all Firestore models
 * @param {string} collectionName - The name of the collection
 *
 */
export default class FirestoreModel<T> {
  constructor(
    private _client: FirestoreClient,
    private _collectionName: string
  ) {}

  /**
   * @description Return all documents in a collection
   *
   * @returns {object}
   *
   * FirestoreCollectionResponse
   * @example
   * {
   *    {
   *     ok: boolean,
   *     payload: documentId#1: {...documentData}
   *     },
   *    {
   *     ok: boolean,
   *     payload: documentId#2: {...documentData}
   *     },
   * ...
   * }
   */
  async findAll(): Promise<T[]> {
    let result: FirestoreDocument[] = [];

    const querySnapshot = await getDocs(
      collection(this._client.connection, this._collectionName)
    );

    querySnapshot.forEach((doc) => {
      const data = { ...doc.data(), id: doc.id };

      result.push(data);
    });

    return result as T[];
  }

  /**
   * @description Return a document by id
   * If a document is not found, return a FirestoreDocumentNotFound error
   *
   * @param {string} documentId
   * @returns {object} - FirestoreDocumentResponse - {ok: boolean, payload: DocumentData | null, error: any}
   */
  async findById(documentId: string): Promise<T | FirestoreDocumentNotFound> {
    const docRef = doc(
      this._client.connection,
      this._collectionName,
      documentId
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return Object.assign(this, docSnap.data()) as T;
    }

    return new FirestoreDocumentNotFound();
  }

  /**
   * @description Add a document to the collection passed as argument
   * If an error occurs, the error is returned in the payload of the response
   *
   * @param {object} data - The document data
   * @returns {object}
   *
   * FirestoreCreationSuccessResponse | FirestoreErrorResponse
   * - *Success response*: {ok: boolean, payload: DocumentData}
   * - *Error response*: {ok: false, error: any}
   */
  async add(data: { [key: string]: any }): Promise<T> {
    try {
      const docRef = await addDoc(
        collection(this._client.connection, this._collectionName),
        {
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );

      const docSnap = await getDoc(docRef);

      return Object.assign(this, { ...docSnap.data(), id: docRef.id }) as T;
    } catch (e) {
      throw new FirestoreDocumentCreationError(errorMessage(e));
    }
  }

  /**
   * @description Update a document by id
   *
   * @param {string} documentId - The document id to update
   * @param {object} updatedData - Data to update
   * @returns {object}
   *
   * FirestoreSuccessResponse | FirestoreErrorResponse
   * - *Success response*: {ok: boolean}
   * - *Error response*: {ok: false, error: any}
   */
  async update(
    documentId: string,
    updatedData: any
  ): Promise<true | FirestoreDocumentUpdateError> {
    try {
      const docRef = doc(
        this._client.connection,
        this._collectionName,
        documentId
      );

      await updateDoc(docRef, {
        ...updatedData,
        updatedAt: new Date().toISOString(),
      });

      return true;
    } catch (e) {
      throw new FirestoreDocumentCreationError(errorMessage(e));
    }
  }

  /**
   * @description Delete a document by id
   *
   * @param {string} documentId - The document id to update
   * @returns {object}
   *
   * FirestoreSuccessResponse | FirestoreErrorResponse
   * - *Success response*: {ok: boolean}
   * - *Error response*: {ok: false, error: any}
   */
  async delete(
    documentId: string
  ): Promise<true | FirestoreDocumentDeletionError> {
    try {
      await deleteDoc(
        doc(this._client.connection, this._collectionName, documentId)
      );
      return true;
    } catch (e) {
      throw new FirestoreDocumentDeletionError(errorMessage(e));
    }
  }

  /**
   * @description Delete all document in a collection
   *
   * @param {string} documentId - The document id to update
   * @returns {object}
   *
   * FirestoreSuccessResponse | FirestoreErrorResponse
   * - *Success response*: {ok: boolean}
   * - *Error response*: {ok: false, error: any}
   */
  async deleteAll(): Promise<true | FirestoreDocumentDeletionError> {
    try {
      const querySnapshot = await getDocs(
        collection(this._client.connection, this._collectionName)
      );

      querySnapshot.forEach(async (document) => {
        await deleteDoc(
          doc(this._client.connection, this._collectionName, document.id)
        );
      });

      return true;
    } catch (e) {
      throw new FirestoreDocumentDeletionError(errorMessage(e));
    }
  }

  /**
   * Return documents that match the query
   *
   * @param field  - The field to search
   * @param operator  - The operator to use
   * @param value  - The value to search
   * @returns  - An array of documents
   */
  async findWhere(
    field: string,
    operator: WhereFilterOp,
    value: any
  ): Promise<T[]> {
    let result: FirestoreDocument[] = [];

    const querySnapshot = await getDocs(
      query(
        collection(this._client.connection, this._collectionName),
        where(field, operator, value)
      )
    );

    querySnapshot.forEach((doc) => {
      const data = { ...doc.data(), id: doc.id };

      result.push(data);
    });

    return result as T[];
  }

  async findWhereIn(
    field: string,
    values: any[]
  ): Promise<T[] | FirestoreDocumentNotFound> {
    let result: FirestoreDocument[] = [];

    const querySnapshot = await getDocs(
      query(
        collection(this._client.connection, this._collectionName),
        where(field, "in", values)
      )
    );

    querySnapshot.forEach((doc) => {
      const data = { ...doc.data(), id: doc.id };

      result.push(data);
    });

    return result as T[];
  }

  async whereCompound(
    field: string,
    operator: WhereFilterOp,
    value: any,
    field2: string,
    operator2: WhereFilterOp,
    value2: any
  ): Promise<T[] | FirestoreDocumentNotFound> {
    let result: FirestoreDocument[] = [];

    const querySnapshot = await getDocs(
      query(
        collection(this._client.connection, this._collectionName),
        where(field, operator, value),
        where(field2, operator2, value2)
      )
    );

    querySnapshot.forEach((doc) => {
      const data = { ...doc.data(), id: doc.id };

      result.push(data);
    });

    return result as T[];
  }
}
