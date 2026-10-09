export function Icon({
  kind,
}: {
  kind: "search" | "links" | "menu" | "accessibility" | "close";
}) {
  const paths = {
    search: (
      <>
        <circle cx="10" cy="10" r="6" />
        <path d="m15 15 5 5" />
      </>
    ),
    links: (
      <>
        <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2" />
        <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2" />
      </>
    ),
    menu: (
      <>
        <path d="M3 5h18M3 12h18M3 19h18" />
      </>
    ),
    accessibility: (
      <>
        <circle cx="12" cy="4" r="2" />
        <path d="M3 9h18M12 8v7m0 0-5 6m5-6 5 6" />
      </>
    ),
    close: <path d="m5 5 14 14M19 5 5 19" />,
  };
  return (
    <svg
      className="ui-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[kind]}
    </svg>
  );
}
