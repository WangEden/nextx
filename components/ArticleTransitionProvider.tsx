"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState,
  type Dispatch, type ReactNode, type SetStateAction,
} from "react";

export type ArchiveState = { query: string; category: string; view: "grid" | "list" };
type ReadingOrigin = {
  href: string; scrollY: number; cardId: string; articlePath: string; filters: ArchiveState;
};
type NavigationOptions = { source?: HTMLElement };
type Transition = { finished: Promise<void>; ready: Promise<void>; skipTransition: () => void };
type TransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void>) => Transition;
};
type PendingNavigation = {
  href: string; scrollY: number; cardId?: string; resolve: () => void;
  timeout: ReturnType<typeof setTimeout>;
};
type TransitionContext = {
  push: (href: string, options?: NavigationOptions) => void;
  closeArticle: () => void;
  archiveState: ArchiveState;
  setArchiveState: Dispatch<SetStateAction<ArchiveState>>;
};

export const ArticleTransitionContext = createContext<TransitionContext | null>(null);
const STORAGE_KEY = "eden-reading-origin-v1";
const INITIAL_FILTERS: ArchiveState = { query: "", category: "全部", view: "grid" };
const isArticle = (path: string) => /^\/archives\/[^/]+\/?$/.test(path);
const normalizePath = (path: string) => decodeURI(path).replace(/\/$/, "") || "/";

function markCard(card: HTMLElement | null) {
  if (!card) return;
  card.style.viewTransitionName = "article-surface";
  const cover = card.querySelector<HTMLElement>("[data-article-cover]");
  const title = card.querySelector<HTMLElement>("[data-article-title]");
  if (cover) cover.style.viewTransitionName = "article-cover";
  if (title) title.style.viewTransitionName = "article-title";
}

function clearCardNames() {
  document.querySelectorAll<HTMLElement>("[data-article-card], [data-article-cover], [data-article-title]")
    .forEach((element) => element.style.removeProperty("view-transition-name"));
}

export function ArticleTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = useRef(pathname);
  const origin = useRef<ReadingOrigin | null>(null);
  const pending = useRef<PendingNavigation | null>(null);
  const busy = useRef(false);
  const redispatching = useRef(false);
  const [archiveState, setArchiveState] = useState<ArchiveState>(INITIAL_FILTERS);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null") as ReadingOrigin | null;
      if (saved && (saved.href === "/" || saved.href === "/archives") &&
          typeof saved.scrollY === "number" && typeof saved.articlePath === "string" &&
          typeof saved.cardId === "string" && saved.filters &&
          typeof saved.filters.query === "string" && typeof saved.filters.category === "string" &&
          ["grid", "list"].includes(saved.filters.view)) {
        origin.current = saved;
        setArchiveState(saved.filters);
      }
    } catch { /* Reading also works when browser storage is unavailable. */ }
  }, []);

  // Stay mounted across route changes and resolve after the destination commits.
  useLayoutEffect(() => {
    currentPath.current = pathname;
    const navigation = pending.current;
    if (!navigation || normalizePath(pathname) !== normalizePath(navigation.href)) return;
    window.scrollTo({ top: navigation.scrollY, behavior: "instant" });
    if (navigation.cardId) markCard(document.getElementById(navigation.cardId));
    const heading = document.querySelector<HTMLElement>(".article-hero__title");
    const focusTarget = navigation.cardId ? document.getElementById(navigation.cardId) : heading;
    focusTarget?.focus({ preventScroll: true });

    let cancelled = false;
    const finishCommit = async () => {
      const cover = document.querySelector<HTMLImageElement>(".article-hero__image img");
      if (cover && !cover.complete) {
        await Promise.race([
          cover.decode().catch(() => undefined),
          new Promise<void>((resolve) => setTimeout(resolve, 450)),
        ]);
      }
      if (cancelled || pending.current !== navigation) return;
      clearTimeout(navigation.timeout);
      pending.current = null;
      navigation.resolve();
    };
    void finishCommit();
    return () => { cancelled = true; };
  }, [pathname]);

  const navigate = useCallback((href: string, options: NavigationOptions = {}, historyAction?: () => void) => {
    if (busy.current || normalizePath(href) === normalizePath(currentPath.current)) return;
    const previousScrollY = window.scrollY;
    const opening = isArticle(href);
    const closing = isArticle(currentPath.current) && !opening;
    if (opening && options.source) {
      origin.current = {
        href: currentPath.current, scrollY: previousScrollY, cardId: options.source.id,
        articlePath: href, filters: archiveState,
      };
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(origin.current)); } catch { /* optional */ }
    }

    const saved = origin.current;
    const sharedSource = options.source || (opening && saved &&
      normalizePath(saved.href) === normalizePath(currentPath.current) &&
      normalizePath(saved.articlePath) === normalizePath(href)
      ? document.getElementById(saved.cardId) : null);
    const returning = closing && saved && normalizePath(saved.href) === normalizePath(href) &&
      normalizePath(saved.articlePath) === normalizePath(currentPath.current);
    const scrollY = returning ? saved.scrollY : 0;
    const cardId = returning ? saved.cardId : undefined;
    if (returning) setArchiveState(saved.filters);

    const doc = document as TransitionDocument;
    const animate = (opening || closing) && typeof doc.startViewTransition === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    busy.current = true;

    const cleanup = () => {
      clearCardNames();
      document.documentElement.removeAttribute("data-article-transition");
      document.documentElement.style.removeProperty("--article-scroll-offset");
      document.documentElement.removeAttribute("aria-busy");
      busy.current = false;
    };
    const update = () => new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        if (pending.current?.resolve === resolve) pending.current = null;
        resolve();
      }, 5000);
      pending.current = { href, scrollY, cardId, resolve, timeout };
      if (historyAction) historyAction();
      else router.push(href, { scroll: false });
    });

    if (!animate) {
      void update().finally(cleanup);
      return;
    }
    document.documentElement.setAttribute("data-article-transition", opening ? "open" : "close");
    document.documentElement.setAttribute("aria-busy", "true");
    if (opening) markCard(sharedSource);
    if (closing) {
      // Snapshot the current reading position in a viewport-sized surface.
      document.documentElement.style.setProperty("--article-scroll-offset", `${-previousScrollY}px`);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    const transition = doc.startViewTransition!(update);
    void transition.ready.catch(() => undefined);
    void transition.finished.catch(() => undefined).finally(cleanup);
  }, [archiveState, router]);

  const closeArticle = useCallback(() => {
    const saved = origin.current;
    const href = saved && normalizePath(saved.articlePath) === normalizePath(currentPath.current)
      ? saved.href : "/archives";
    // Replace also closes reliably after in-article anchor navigation adds history entries.
    navigate(href, {}, () => router.replace(href, { scroll: false }));
  }, [navigate, router]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (redispatching.current || busy.current || !event.state?.__NA) return;
      const destination = window.location.pathname;
      if (!isArticle(currentPath.current) && !isArticle(destination)) return;
      if (normalizePath(destination) === normalizePath(currentPath.current)) return;
      // Let Next handle Back/Forward after the old screen has been captured.
      event.stopImmediatePropagation();
      navigate(destination, {}, () => {
        redispatching.current = true;
        window.dispatchEvent(new PopStateEvent("popstate", { state: event.state }));
        redispatching.current = false;
      });
    };
    window.addEventListener("popstate", handlePopState, true);
    return () => window.removeEventListener("popstate", handlePopState, true);
  }, [navigate]);

  useEffect(() => () => {
    if (pending.current) {
      clearTimeout(pending.current.timeout);
      pending.current.resolve();
    }
  }, []);

  const value = useMemo(() => ({ push: navigate, closeArticle, archiveState, setArchiveState }),
    [navigate, closeArticle, archiveState]);
  return <ArticleTransitionContext.Provider value={value}>{children}</ArticleTransitionContext.Provider>;
}
