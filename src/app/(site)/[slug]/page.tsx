import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/pages/ContentPage";
import { loadImages, loadPage, loadPages, loadUi } from "@/content/loaders";

// These have their own routes; every other content page renders here.
const DEDICATED = new Set(["home", "uncharted", "davy-jones-locker"]);

export const dynamicParams = false;

export function generateStaticParams() {
  return loadPages()
    .filter((page) => !DEDICATED.has(page.slug))
    .map((page) => ({ slug: page.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = loadPage(slug);
  return {
    title: page.seo.pirateTitle,
    description: page.seo.pirateDescription,
  };
}

export default async function InnerPage({ params }: Params) {
  const { slug } = await params;
  if (DEDICATED.has(slug)) notFound();
  const page = loadPage(slug);
  const builtRoutes = loadPages().map((entry) =>
    entry.slug === "home" ? "/" : `/${entry.slug}`,
  );
  return (
    <ContentPage
      page={page}
      ui={loadUi()}
      images={loadImages()}
      builtRoutes={builtRoutes}
    />
  );
}
