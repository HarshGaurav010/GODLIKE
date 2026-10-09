import { HomePage } from "@/components/content/HomePage";
import { loadImages, loadPage, loadPages, loadUi } from "@/content/loaders";

const page = loadPage("home");
export const metadata = {
  title: { absolute: `${loadUi().brand.pirate} · ${page.seo.pirateTitle}` },
  description: page.seo.pirateDescription,
};
export default function Home() {
  const builtRoutes = loadPages().map((entry) =>
    entry.slug === "home" ? "/" : `/${entry.slug}`,
  );
  return (
    <HomePage
      page={page}
      ui={loadUi()}
      images={loadImages()}
      builtRoutes={builtRoutes}
    />
  );
}
