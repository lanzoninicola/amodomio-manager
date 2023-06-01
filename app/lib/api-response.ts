import { json } from "@remix-run/node";

interface ApiResponseData extends Record<string, unknown> {
  message: string;
}

export function badRequest(data: ApiResponseData) {
  return json({ status: 400, ...data }, { status: 400 });
}

export function notFound(data: ApiResponseData) {
  return json({ status: 404, ...data }, { status: 404 });
}

export function serverError(data: ApiResponseData) {
  return json({ status: 500, ...data }, { status: 500 });
}

export function ok(data?: ApiResponseData) {
  return json(
    {
      status: 200,
      message: "ok",
      ...data,
    },
    { status: 200 }
  );
}
