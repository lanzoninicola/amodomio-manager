import { useNavigate } from "@remix-run/react";
import { useState, useEffect, useCallback } from "react";

export default function useEasterEggRedirection({
  redirectTo,
}: {
  redirectTo: string;
}) {
  const [clickedAmount, setClickedAmount] = useState(0);
  const navigate = useNavigate();

  function increaseAmount() {
    if (clickedAmount === 2) {
      setClickedAmount(0);
      return;
    }
    setClickedAmount(clickedAmount + 1);
  }

  const navigateTo = useCallback(() => {
    navigate(redirectTo);
  }, [navigate, redirectTo]);

  useEffect(() => {
    if (clickedAmount === 2) {
      navigateTo();
    }
  }, [clickedAmount, navigateTo]);

  return { increaseAmount };
}
