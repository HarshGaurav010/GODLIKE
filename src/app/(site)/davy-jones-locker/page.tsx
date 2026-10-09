import { UtilityPage } from "@/components/content/UtilityPage";
import { loadPage, loadUi } from "@/content/loaders";

const page = loadPage("davy-jones-locker");
export const metadata = {
  title: page.seo.pirateTitle,
  description: page.seo.pirateDescription,
};
export default function LockerPage() {
  return <UtilityPage page={page} ui={loadUi()} />;
}
