import { json } from "@remix-run/node";

type LoaderOrActionReturnType = Record<string, any> | undefined;

interface HttpResponse {
  status: number;
  message?: string;
  payload?: any;
}

export function notFound(
  loaderOrActionReturnData?: LoaderOrActionReturnType
): HttpResponse {
  return formatResponse(
    { status: 404, message: "Não encontrado" },
    loaderOrActionReturnData
  );
}

export function badRequest(
  loaderOrActionReturnData?: LoaderOrActionReturnType
): HttpResponse {
  return formatResponse(
    { status: 400, message: "Requisição inválida" },
    loaderOrActionReturnData
  );
}

export function unauthorized(
  loaderOrActionReturnData?: LoaderOrActionReturnType
) {
  return formatResponse(
    { status: 400, message: "Requisição inválida" },
    loaderOrActionReturnData
  );
}

export function forbidden(loaderOrActionReturnData?: LoaderOrActionReturnType) {
  return formatResponse(
    { status: 403, message: "Requisição inválida" },
    loaderOrActionReturnData
  );
}

export function serverError(error: Error | any) {
  if (error instanceof Error) {
    return formatResponse(
      { status: 500, message: "Erro interno do servidor" },
      {
        message: error.message,
        payload: error.stack,
      }
    );
  }

  return formatResponse(
    { status: 500, message: "Erro interno do servidor" },
    { message: error }
  );
}

export function ok(loaderOrActionReturnData?: LoaderOrActionReturnType) {
  return formatResponse(
    { status: 200, message: "ok" },
    loaderOrActionReturnData
  );
}

export function created(loaderOrActionReturnData?: LoaderOrActionReturnType) {
  return formatResponse(
    { status: 201, message: "Recurso criado" },
    loaderOrActionReturnData
  );
}

export function noContent(loaderOrActionReturnData?: LoaderOrActionReturnType) {
  return formatResponse({ status: 204, message: "" }, loaderOrActionReturnData);
}

function formatResponse(
  basicResponse: { status: number; message: string },
  loaderOrActionReturnData: LoaderOrActionReturnType
): HttpResponse {
  const response: HttpResponse = { ...basicResponse };

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

  return json(response, { status: response.status });
}
