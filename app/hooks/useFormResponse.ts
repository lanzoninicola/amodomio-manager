import { useActionData } from "@remix-run/react";
import type { HttpResponse } from "~/utils/http-response.server";

export default function useFormResponse() {
  const actionData = useActionData<HttpResponse | undefined>();
  let isError = false;
  let errorMessage = "";
  let data = actionData?.payload;

  if (actionData && actionData.status !== 200) {
    isError = true;
    errorMessage = actionData.message ?? "An error occurred";
  }

  return {
    isError,
    errorMessage,
    data,
  };
}
