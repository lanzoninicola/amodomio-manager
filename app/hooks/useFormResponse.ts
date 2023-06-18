import { useActionData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import type { HttpResponse } from "~/utils/http-response.server";

interface useFormResponseReturnType {
  // isError is used to display an error message (DO NOT USE "isError === true" to display an error message)
  isError: boolean;
  // isOk is used to display a success message (DO NOT USE "isError === false" to display a success message)
  isOk: boolean;
  // formRef is used to reset the form after a successful submission
  formRef: React.MutableRefObject<HTMLFormElement | null>;
  // inputFocusRef is used to focus the input after a successful submission
  inputFocusRef: React.MutableRefObject<HTMLInputElement | null>;
  // errorMessage is used to display an error message
  errorMessage: string;
  // data is the response data (payload field of the HttpResponse interface)
  data: HttpResponse | undefined;
}

export default function useFormResponse(): useFormResponseReturnType {
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
    isOk,
    formRef,
    inputFocusRef,
    errorMessage,
    data,
  };
}
