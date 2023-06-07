import httpStatus from "http-status";
import ApiError from "./api-error";

/**
 * Throws an error with the HTTP status code 500
 * @param {string} message
 * @param {object} options
 * Options object with the following properties:
 * - param {object} options.logger - The logger object to be used. If not provided, the error will not be logged.
 * - param {object} options.loggerPayload - The payload to be logged
 */
export function serverError(
  message: string,
  options = {
    logger: null,
    loggerPayload: null,
    returning: false,
  }
) {
  logError(message, options);

  const error = new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message);

  if (options.returning && options.returning === true) {
    return error;
  }

  throw error;
}

/**
 * Throws an error with the HTTP status code 400
 * @param {string} message
 * @param {object} options
 * Options object with the following properties:
 * - param {object} options.logger - The logger object to be used. If not provided, the error will not be logged.
 * - param {object} options.loggerPayload - The payload to be logged
 */
export function badRequest(
  message: string,
  options = {
    logger: null,
    loggerPayload: null,
    returning: false,
  }
) {
  logError(message, options);

  const error = new ApiError(httpStatus.BAD_REQUEST, message);

  if (options.returning && options.returning === true) {
    return error;
  }

  throw error;
}

/**
 * Throws an error with the HTTP status code 404
 * @param {string} message
 * @param {object} options
 * Options object with the following properties:
 * - param {object} options.logger - The logger object to be used. If not provided, the error will not be logged.
 * - param {object} options.loggerPayload - The payload to be logged
 */
export function notFound(
  message: string,
  options = {
    logger: null,
    loggerPayload: null,
    returning: false,
  }
) {
  logError(message, options);

  const error = new ApiError(httpStatus.NOT_FOUND, message);

  if (options.returning && options.returning === true) {
    return error;
  }

  throw error;
}

/**
 * Throws an error with the HTTP status code 401
 * @param {string} message
 * @param {object} options
 * Options object with the following properties:
 * - param {object} options.logger - The logger object to be used. If not provided, the error will not be logged.
 * - param {object} options.loggerPayload - The payload to be logged
 */
export function unauthorized(
  message: string,
  options = {
    logger: null,
    loggerPayload: null,
    returning: false,
  }
) {
  logError(message, options);

  const error = new ApiError(httpStatus.UNAUTHORIZED, message);

  if (options.returning && options.returning === true) {
    return error;
  }

  throw error;
}

/**
 * Throws an error with the HTTP status code 429
 * @param {string} message
 * @param {object} options
 * Options object with the following properties:
 * - param {object} options.logger - The logger object to be used. If not provided, the error will not be logged.
 * - param {object} options.loggerPayload - The payload to be logged
 */
export function tooManyRequests(
  message: string,
  options = {
    logger: null,
    loggerPayload: null,
    returning: false,
  }
) {
  logError(message, options);

  const error = new ApiError(httpStatus.TOO_MANY_REQUESTS, message);

  if (options.returning && options.returning === true) {
    return error;
  }

  throw error;
}

/**
 * Throws an error with the HTTP status code 400
 * @param {string} message
 * @param {object} options
 * Options object with the following properties:
 * - param {object} options.logger - The logger object to be used. If not provided, the error will not be logged.
 * - param {object} options.loggerPayload - The payload to be logged
 */
export function invalidError(
  message: string,
  options = {
    logger: null,
    loggerPayload: null,
    returning: false,
  }
) {
  logError(message, options);

  const error = new ApiError(httpStatus.BAD_REQUEST, message);

  if (options.returning && options.returning === true) {
    return error;
  }

  throw error;
}

export function logError(
  message: string,
  options = {
    logger: null,
    loggerPayload: null,
  }
) {
  if (options.logger && options.logger?.error) {
    const messagePayload = {
      message,
    };

    if (options.loggerPayload) {
      messagePayload.payload = options.loggerPayload;
    }

    options.logger.error(JSON.stringify(messagePayload, null, 2));
  }
}
