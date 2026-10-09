"use client";
import { useState } from "react";
import type { SearchEntry } from "@/content/global-schemas";
import type { ContentMode } from "@/content/types";
import { SafeNavLink } from "./SafeNavLink";

export function SiteSearch({
  entries,
  mode,
  title,
  placeholder,
  hint,
  empty,
  resultsLabel,
  builtRoutes,
  onNavigate,
  buttonLabel,
}: {
  entries: SearchEntry[];
  mode: ContentMode;
  title: string;
  placeholder: string;
  hint: string;
  empty: string;
  resultsLabel: string;
  builtRoutes: string[];
  onNavigate: () => void;
  buttonLabel: string;
}) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim().toLocaleLowerCase();
  const results = trimmed
    ? entries
        .filter((entry) =>
          `${entry.original} ${entry.pirate}`
            .toLocaleLowerCase()
            .includes(trimmed),
        )
        .slice(0, 12)
    : [];
  return (
    <div className="site-search">
      <form role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="site-search-input">{title}</label>
        <input
          data-initial-focus
          id="site-search-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          aria-describedby="search-help"
        />
        <button type="submit" className="utility-action">
          {buttonLabel}
        </button>
      </form>
      <p id="search-help">{hint}</p>
      <div aria-live="polite" aria-atomic="true">
        {trimmed && !results.length ? <p>{empty}</p> : null}
      </div>
      {results.length ? (
        <nav aria-label={resultsLabel}>
          <ul>
            {results.map((entry) => (
              <li key={`${entry.href}-${entry.original}`}>
                <SafeNavLink
                  href={entry.href}
                  builtRoutes={builtRoutes}
                  onNavigate={onNavigate}
                >
                  {entry[mode]}
                </SafeNavLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
