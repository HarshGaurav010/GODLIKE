"use client";
import { useEffect, useRef } from "react";
import type { NavItem } from "@/content/global-schemas";
import { SafeNavLink } from "./SafeNavLink";

export function MegaMenu({
  rows,
  builtRoutes,
  label,
}: {
  rows: NavItem[][];
  builtRoutes: string[];
  label: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    function close(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node))
        ref.current?.querySelectorAll("details[open]").forEach((detail) => {
          (detail as HTMLDetailsElement).open = false;
        });
    }
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  return (
    <nav className="desktop-nav hidden lg:flex" aria-label={label} ref={ref}>
      {rows.map((row, index) => (
        <ul className="nav-row" key={index}>
          {row.map((item) => (
            <li key={item.id}>
              {item.children.length ? (
                <details
                  className="nav-dropdown"
                  name="site-navigation"
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      event.preventDefault();
                      event.stopPropagation();
                      event.currentTarget.open = false;
                      event.currentTarget.querySelector("summary")?.focus();
                    }
                  }}
                >
                  <summary>
                    {item.label}
                    <span aria-hidden="true" className="nav-chevron">
                      ⌄
                    </span>
                  </summary>
                  <div className="mega-panel">
                    {item.children.map((child) => (
                      <div className="mega-column" key={child.id}>
                        {child.children.length ? (
                          <>
                            <strong className="mega-label">
                              {child.label}
                            </strong>
                            <ul>
                              {child.children.map((leaf) => (
                                <li key={leaf.id}>
                                  <SafeNavLink
                                    href={leaf.href}
                                    builtRoutes={builtRoutes}
                                    onNavigate={() => {
                                      ref.current
                                        ?.querySelectorAll("details[open]")
                                        .forEach((detail) => {
                                          (detail as HTMLDetailsElement).open =
                                            false;
                                        });
                                    }}
                                  >
                                    {leaf.label}
                                  </SafeNavLink>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <SafeNavLink
                            href={child.href}
                            builtRoutes={builtRoutes}
                            onNavigate={() => {
                              ref.current
                                ?.querySelectorAll("details[open]")
                                .forEach((detail) => {
                                  (detail as HTMLDetailsElement).open = false;
                                });
                            }}
                          >
                            {child.label}
                          </SafeNavLink>
                        )}
                      </div>
                    ))}
                  </div>
                </details>
              ) : (
                <SafeNavLink href={item.href} builtRoutes={builtRoutes}>
                  {item.label}
                </SafeNavLink>
              )}
            </li>
          ))}
        </ul>
      ))}
    </nav>
  );
}
