export class FirestoreDocumentNotFound extends Error {
  constructor() {
    super("Document not found");
  }
}

export class FirestoreDocumentCreationError extends Error {
  additionalInfo?: string;

  constructor(additionalInfo?: string) {
    super(`Document not created: ${additionalInfo}`);
    this.additionalInfo = additionalInfo;
  }
}

export class FirestoreDocumentUpdateError extends Error {
  additionalInfo?: string;

  constructor(additionalInfo?: string) {
    super(`Document not updated: ${additionalInfo}`);
    this.additionalInfo = additionalInfo;
  }
}

export class FirestoreDocumentDeletionError extends Error {
  additionalInfo?: string;

  constructor(additionalInfo?: string) {
    super(`Document not deleted: ${additionalInfo}`);
    this.additionalInfo = additionalInfo;
  }
}
