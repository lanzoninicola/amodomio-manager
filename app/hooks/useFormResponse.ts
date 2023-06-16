import { useActionData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import type { HttpResponse } from "~/utils/http-response.server";

export default function useFormResponse() {
  const actionData = useActionData<HttpResponse | undefined>();
  const [isError, setIsError] = useState(false);
  const [isOk, setIsOk] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState(actionData?.payload);

  let formRef = useRef<HTMLFormElement>(null);
  let inputFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData && actionData.status !== 200) {
      setIsError(true);
      setErrorMessage(actionData.message ?? "An error occurred");
    }

    if (actionData && actionData.status === 200) {
      setData(actionData.payload);
      setIsOk(true);

      if (formRef.current) {
        formRef.current.reset();
        inputFocusRef.current?.focus();
      }
    }
  }, [actionData, actionData?.status]);

  return {
    isError,
    // isOk is used to display a success message
    isOk,
    // formRef is used to reset the form after a successful submission
    formRef,
    // inputFocusRef is used to focus the input after a successful submission
    inputFocusRef,
    errorMessage,
    data,
  };
}
