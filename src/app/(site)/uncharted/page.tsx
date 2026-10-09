import { UtilityPage } from "@/components/content/UtilityPage";
import { loadPage, loadUi } from "@/content/loaders";

const page = loadPage("uncharted");
export const metadata = {
  title: page.seo.pirateTitle,
  description: page.seo.pirateDescription,
};
export default function UnchartedPage() {
  return <UtilityPage page={page} ui={loadUi()} />;
}
