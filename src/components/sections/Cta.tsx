import Link from "next/link";
import { ctaSchema } from "@/content/schemas";
import type { Json } from "@/content/types";

export function Cta({
  id,
  content,
}: {
  id: string;
  content: Record<string, Json>;
}) {
  const data = ctaSchema.parse(content);
  return (
    <div id={id} data-section-kind="cta">
      <Link className="utility-action" href={data.href}>
        {data.label}
      </Link>
    </div>
  );
}
