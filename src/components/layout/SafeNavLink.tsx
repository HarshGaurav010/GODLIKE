import Link from "next/link";
import { resolveLink } from "@/content/links";

export function destination(href: string, builtRoutes: string[]) {
  let slug = "home";
  try {
    slug =
      new URL(href, "https://www.iitism.ac.in").pathname.replace(
        /^\/|\/$/g,
        "",
      ) || "home";
  } catch {
    /* The resolver sends invalid destinations to the locker. */
  }
  return resolveLink(href, builtRoutes, slug);
}
export function SafeNavLink({
  href,
  builtRoutes,
  children,
  className,
  onNavigate,
}: {
  href: string;
  builtRoutes: string[];
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={destination(href, builtRoutes)}
      className={className}
      onClick={onNavigate}
    >
      {children}
    </Link>
  );
}
