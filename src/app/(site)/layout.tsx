import {
  loadHeader,
  loadFooter,
  loadImages,
  loadUi,
  loadPages,
} from "@/content/loaders";
import type { NavItem, SearchEntry } from "@/content/global-schemas";
import { SiteShell } from "@/components/layout/SiteShell";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const header = loadHeader();
  const footer = loadFooter();
  const pages = loadPages();
  const entries: SearchEntry[] = [];
  function collect(original: NavItem[], pirate: NavItem[]) {
    original.forEach((item, index) => {
      if (item.children.length) collect(item.children, pirate[index].children);
      else
        entries.push({
          original: item.label,
          pirate: pirate[index].label,
          href: item.href,
        });
    });
  }
  collect(header.original.nav, header.pirate.nav);
  collect(footer.original.resources, footer.pirate.resources);
  pages.forEach((page) =>
    entries.push({
      ...page.title,
      href: page.slug === "home" ? "/" : `/${page.slug}`,
    }),
  );
  const unique = Array.from(
    new Map(
      entries.map((entry) => [`${entry.href}:${entry.original}`, entry]),
    ).values(),
  );
  return (
    <SiteShell
      header={header}
      footer={footer}
      images={loadImages()}
      ui={loadUi()}
      builtRoutes={pages.map((page) =>
        page.slug === "home" ? "/" : `/${page.slug}`,
      )}
      searchEntries={unique}
    >
      {children}
    </SiteShell>
  );
}
