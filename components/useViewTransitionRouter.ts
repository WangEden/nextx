"use client";

import { useContext } from "react";
import { ArticleTransitionContext } from "./ArticleTransitionProvider";

export function useViewTransitionRouter() {
  const context = useContext(ArticleTransitionContext);
  if (!context) throw new Error("useViewTransitionRouter requires ArticleTransitionProvider");
  return context;
}
