import type { FieldPath, WhereFilterOp } from "firebase/firestore";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { FirestoreDocumentUpdateError } from "./firestore-errors.server";
import { FirestoreDocumentDeletionError } from "./firestore-errors.server";
import { FirestoreDocumentCreationError } from "./firestore-errors.server";
import type FirestoreClient from "./firestore-client.server";

import type { FirestoreDocument } from "../types";
import errorMessage from "../utils/error-message";

export type whereCompoundCondition = {
  field: string | FieldPath;
  op: WhereFilterOp;
  value: any;
};

export type whereCompoundConditions = whereCompoundCondition[];

/**
 * @class FirestoreModel
 * @description A class that provides a base for all Firestore models
 * @param {string} collectionName - The name of the collection
 *
 */
export class FirestoreModel<T> {
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
  async findById(documentId: string): Promise<T | null> {
    const docRef = doc(
      this._client.connection,
      this._collectionName,
      documentId
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return Object.assign(this, { ...docSnap.data(), id: docSnap.id }) as T;
    }

    return null;
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
      throw new FirestoreDocumentUpdateError(errorMessage(e));
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

  async deleteWhere(
    conditions: whereCompoundConditions
  ): Promise<true | FirestoreDocumentDeletionError> {
    try {
      const queryFilters = conditions.map((condition) => {
        return where(condition.field, condition.op, condition.value);
      });

      const querySnapshot = await getDocs(
        query(
          collection(this._client.connection, this._collectionName),
          ...queryFilters
        )
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

  async findWhereIn(field: string, values: any[]): Promise<T[] | null> {
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

  /**
   * Return the first document that match the query
   *
   * @param field  - The field to search
   * @param operator  - The operator to use
   * @param value  - The value to search
   * @returns  - An array of documents
   */
  async findOne(conditions: whereCompoundConditions): Promise<T | null> {
    const result = await this.whereCompound(conditions);

    if (result.length === 0) {
      return null;
    }

    return result[0] as T;
  }

  async whereCompound(conditions: whereCompoundConditions): Promise<T[] | []> {
    let result: FirestoreDocument[] = [];

    const queryFilters = conditions.map((condition) => {
      return where(condition.field, condition.op, condition.value);
    });

    const querySnapshot = await getDocs(
      query(
        collection(this._client.connection, this._collectionName),
        ...queryFilters
      )
    );

    querySnapshot.forEach((doc) => {
      const data = { ...doc.data(), id: doc.id };

      result.push(data);
    });

    return result as T[];
  }

  async getLatest(): Promise<T> {
    let result: FirestoreDocument[] = [];

    const querySnapshot = await getDocs(
      query(
        collection(this._client.connection, this._collectionName),
        orderBy("createdAt", "desc")
      )
    );

    querySnapshot.forEach((doc) => {
      const data = { ...doc.data(), id: doc.id };

      result.push(data);
    });

    return result[0] as T;
  }
}
