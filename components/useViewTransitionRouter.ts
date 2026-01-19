"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

type ResolveFn = (() => void) | null;

export function useViewTransitionRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const pendingResolve = useRef<ResolveFn>(null);

  useEffect(() => {
    if (pendingResolve.current) {
      pendingResolve.current();
      pendingResolve.current = null;
    }
  }, [pathname]);

  const push = useCallback(
    (href: string) => {
      if (typeof document === "undefined") {
        router.push(href);
        return;
      }

      const doc = document as Document & {
        startViewTransition?: (cb: () => void | Promise<void>) => void;
      };

      if (!doc.startViewTransition) {
        router.push(href);
        return;
      }

      doc.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            pendingResolve.current = resolve;
            router.push(href);
          })
      );
    },
    [router]
  );

  return { push };
}
