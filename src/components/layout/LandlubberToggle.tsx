"use client";
import { useLanguage } from "@/components/content/LanguageProvider";

export function LandlubberToggle({
  label,
  originalLabel,
  pirateLabel,
}: {
  label: string;
  originalLabel: string;
  pirateLabel: string;
}) {
  const { mode, setMode } = useLanguage();
  return (
    <div className="language-control" role="group" aria-label={label}>
      <button
        type="button"
        aria-pressed={mode === "original"}
        onClick={() => setMode("original")}
      >
        {originalLabel}
      </button>
      <button
        type="button"
        aria-pressed={mode === "pirate"}
        onClick={() => setMode("pirate")}
      >
        {pirateLabel}
      </button>
    </div>
  );
}
