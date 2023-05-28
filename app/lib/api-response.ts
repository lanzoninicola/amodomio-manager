import { json } from "@remix-run/node";

interface ApiResponseData extends Record<string, unknown> {
  message: string;
}

export function badRequest(data: ApiResponseData) {
  return json(data, { status: 400 });
}

export function notFound(data: ApiResponseData) {
  return json(data, { status: 404 });
}

export function ok(data?: ApiResponseData) {
  return json(
    {
      message: "ok",
      ...data,
    },
    { status: 200 }
  );
}
