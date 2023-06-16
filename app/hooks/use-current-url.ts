import { useLocation } from "@remix-run/react";

export default function useCurrentUrl() {
  const { pathname, search } = useLocation();
  const currentUrl = `${pathname}${search}`;

  return currentUrl;
}
