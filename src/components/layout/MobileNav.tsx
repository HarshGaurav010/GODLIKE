import type { NavItem } from "@/content/global-schemas";
import { SafeNavLink } from "./SafeNavLink";

function Branch({
  item,
  builtRoutes,
  onNavigate,
}: {
  item: NavItem;
  builtRoutes: string[];
  onNavigate: () => void;
}) {
  return (
    <li>
      {item.children.length ? (
        <details className="mobile-branch">
          <summary>{item.label}</summary>
          <ul>
            {item.children.map((child) => (
              <Branch
                key={child.id}
                item={child}
                builtRoutes={builtRoutes}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        </details>
      ) : (
        <SafeNavLink
          href={item.href}
          builtRoutes={builtRoutes}
          onNavigate={onNavigate}
        >
          {item.label}
        </SafeNavLink>
      )}
    </li>
  );
}
export function MobileNav({
  items,
  builtRoutes,
  onNavigate,
  label,
}: {
  items: NavItem[];
  builtRoutes: string[];
  onNavigate: () => void;
  label: string;
}) {
  return (
    <nav aria-label={label} className="mobile-nav">
      <ul>
        {items.map((item) => (
          <Branch
            key={item.id}
            item={item}
            builtRoutes={builtRoutes}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
    </nav>
  );
}
