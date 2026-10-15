import { useEffect, useState } from "react";
import liff from "@line/liff";

export type LiffState =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "error"; error: unknown };

export function useLiff(liffId: string = import.meta.env.VITE_LIFF_ID) {
  const [state, setState] = useState<LiffState>({ status: "loading" });

  useEffect(() => {
    let active = true;

    liff
      .init({ liffId })
      .then(() => {
        if (active) setState({ status: "ready" });
      })
      .catch((error: unknown) => {
        if (active) setState({ status: "error", error });
      });

    return () => {
      active = false;
    };
  }, [liffId]);

  return state;
}
