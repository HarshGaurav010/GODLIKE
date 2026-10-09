const SOURCE_ORIGIN = "https://www.iitism.ac.in";
const UTILITY_ROUTES = ["/uncharted", "/davy-jones-locker"];
// Source paths that duplicate a page we serve under another route.
const ALIASES: Record<string, string> = { "/home": "/" };
const FILE_EXTENSION =
  /\.(?:pdf|docx?|xlsx?|pptx?|zip|rar|mp4|mp3|png|jpe?g|gif|svg|webp|xml|txt)$/i;

export function resolveLink(
  href: string,
  builtRoutes: readonly string[] = [],
  from = "home",
): string {
  if (href.startsWith("#")) return /^#[a-zA-Z0-9_-]+$/.test(href) ? href : "#";
  let url: URL;
  try {
    url = new URL(href, SOURCE_ORIGIN);
  } catch {
    return "/davy-jones-locker";
  }
  const sourcePath = url.pathname.replace(/\/$/, "") || "/";
  const pathname = ALIASES[sourcePath] ?? sourcePath;
  if (
    url.origin !== SOURCE_ORIGIN ||
    FILE_EXTENSION.test(pathname) ||
    /(^|\/)(?:storage|login|logout|signin|auth|portal)(\/|$)/i.test(pathname)
  ) {
    return "/davy-jones-locker";
  }
  if (UTILITY_ROUTES.includes(pathname) || builtRoutes.includes(pathname)) {
    return pathname + url.search + url.hash;
  }
  return `/uncharted?from=${encodeURIComponent(from)}`;
}
