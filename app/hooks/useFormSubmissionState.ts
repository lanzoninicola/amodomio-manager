import { useNavigation } from "@remix-run/react";

export default function useFormSubmissionnState():
  | "idle"
  | "submitting"
  | "loading"
  | "submittingOrLoading" {
  const navigation = useNavigation();

  if (navigation.state === "submitting") {
    return "submitting";
  }

  if (navigation.state === "loading") {
    return "loading";
  }

  return "idle";
}
