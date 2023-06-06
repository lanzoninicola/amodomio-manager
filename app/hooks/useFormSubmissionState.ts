import { useNavigation } from "@remix-run/react";

export default function useFormSubmissionnState(): "idle" | "inProgress" {
  const navigation = useNavigation();

  if (navigation.state === "submitting" || navigation.state === "loading") {
    return "inProgress";
  }

  return "idle";
}
