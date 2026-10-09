"use client";

import { useEffect, type RefObject } from "react";

/** Progressive decoration: content stays visible without JavaScript. */
export function useVoyageEffects(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("voyage-arrived");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    root
      .querySelectorAll(
        ".section-heading, .leader-message-inner, .story-card, .research-card, .academics-feature",
      )
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [ref]);
}
