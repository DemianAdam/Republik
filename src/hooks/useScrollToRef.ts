import { RefObject } from "react";

export type ScrollTargets = Record<string, RefObject<HTMLElement>>;

export function useScrollToRef(targets: ScrollTargets) {
  return (key: string) => {
    const target = targets[key];
    target?.current?.scrollIntoView({ behavior: "smooth" });
  };
}