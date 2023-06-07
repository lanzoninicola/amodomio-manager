import { json } from "@remix-run/node";

type LoaderOrActionReturnType = Record<string, any> | string | undefined;

export interface HttpResponse {
  status: number;
  message?: string;
  action?: string;
  payload?: any;
}

export function notFound(
  loaderOrActionReturnData?: LoaderOrActionReturnType,
  options = { throwIt: false }
): HttpResponse {
  const response = formatResponse(
    { status: 404, fallbackMessage: "Não encontrado" },
    loaderOrActionReturnData
  );

  return doResponse(response, options);
}

export function badRequest(
  loaderOrActionReturnData?: LoaderOrActionReturnType,
  options = { throwIt: false }
): HttpResponse | void {
  const response = formatResponse(
    { status: 400, fallbackMessage: "Requisição inválida" },
    loaderOrActionReturnData
  );

  return doResponse(response, options);
}

export function unauthorized(
  loaderOrActionReturnData?: LoaderOrActionReturnType,
  options = { throwIt: false }
) {
  const response = formatResponse(
    { status: 401, fallbackMessage: "Não autorizado" },
    loaderOrActionReturnData
  );

  return doResponse(response, options);
}

export function forbidden(
  loaderOrActionReturnData?: LoaderOrActionReturnType,
  options = { throwIt: false }
) {
  const response = formatResponse(
    { status: 403, fallbackMessage: "Requisição inválida" },
    loaderOrActionReturnData
  );

  return doResponse(response, options);
}

export function serverError(error: Error | any, options = { throwIt: false }) {
  if (error instanceof Error) {
    const response = formatResponse(
      { status: 500, fallbackMessage: "Erro interno do servidor" },
      {
        message: error.message,
        payload: error.stack,
      }
    );

    return doResponse(response, options);
  }

  const response = formatResponse(
    { status: 500, fallbackMessage: "Erro interno do servidor" },
    { message: error }
  );

  return doResponse(response, options);
}

export function ok(loaderOrActionReturnData?: LoaderOrActionReturnType) {
  const response = formatResponse(
    { status: 200, fallbackMessage: "Ok" },
    loaderOrActionReturnData
  );

  return doResponse(response);
}

export function created(loaderOrActionReturnData?: LoaderOrActionReturnType) {
  const response = formatResponse(
    { status: 201, fallbackMessage: "Recurso criado" },
    loaderOrActionReturnData
  );

  return doResponse(response);
}

export function noContent(loaderOrActionReturnData?: LoaderOrActionReturnType) {
  const response = formatResponse(
    { status: 204, fallbackMessage: "Nenhum conteúdo" },
    loaderOrActionReturnData
  );

  return doResponse(response);
}

function doResponse(response: HttpResponse, options = { throwIt: false }) {
  if (options.throwIt) {
    throw new Error(response.message);
  }

  return json(response, { status: response.status });
}

function formatResponse(
  defaultResponse: { status: number; fallbackMessage: string },
  loaderOrActionReturnData: LoaderOrActionReturnType
): HttpResponse {
  // the loader or action returned a string (no payload in the response only a message)
  if (typeof loaderOrActionReturnData === "string") {
    return {
      status: defaultResponse.status,
      message: loaderOrActionReturnData,
    };
  }

  // the loader or action returned an object with a message and a payload
  const response: HttpResponse = {
    status: defaultResponse.status,
    message: defaultResponse.fallbackMessage,
  };

  if (loaderOrActionReturnData?.message) {
    response.message = loaderOrActionReturnData.message;
  }

  if (loaderOrActionReturnData?.payload) {
    response.payload = loaderOrActionReturnData.payload;
  }

  if (loaderOrActionReturnData?.payload === undefined) {
    response.payload = loaderOrActionReturnData;

    if (loaderOrActionReturnData?.message) {
      delete response.payload.message;
    }
  }

  // return json(response, { status: response.status });
  return response;
}
