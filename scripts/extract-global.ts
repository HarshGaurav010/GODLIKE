import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { load } from "cheerio";
import { normalizeDocument, extractImages } from "./lib/scrape-cache";

const sourceUrl = "https://www.iitism.ac.in/";
const doc = normalizeDocument(
  JSON.parse(readFileSync("scrape/raw/home.json", "utf8")),
);
const $ = load(doc.html);
const clean = (node: Parameters<typeof $>[0]) =>
  $(node).text().replace(/\s+/g, " ").trim();
const glossary: Array<{ original: string; pirate: string }> = JSON.parse(
  readFileSync("content/glossary.json", "utf8"),
);
const terms = new Map(glossary.map((term) => [term.original, term.pirate]));
const required = (label: string) => {
  const value = terms.get(label);
  if (!value) throw new Error(`Missing glossary term: ${label}`);
  return value;
};
const first = (label: string) => required(label).split(" / ")[0];
const second = (label: string) => required(label).split(" / ")[1];
const aliases: Record<string, string> = {
  Home: "Home Port",
  Admission: first("Admissions / JEE"),
  Department: required("Departments"),
  Centers: required("Centres"),
  "Officers & Staff": required("Staff & Officers"),
  Research: first("Research / Research clusters"),
  "Research Cluster": second("Research / Research clusters"),
  Placement: required("Career Development Centre (placements)"),
  Chairman: required("Chairman, Board of Governors"),
  Deans: first("Deans / Associate Deans"),
  "Associate Deans": second("Deans / Associate Deans"),
  HoDs: required("Heads of Department"),
  PhD: required("PhD Admission"),
  Contact: required("Contact Us"),
  UG: "Undergraduate Deck",
  PG: "Postgraduate Deck",
  "B. Tech": "B. Tech Deckhands",
  "BS MS": "BS MS Deckhands",
  "B.Sc.-B.Ed.": "B.Sc.-B.Ed. Teaching Crew",
  "M.Tech": "M.Tech Navigators",
  MBA: "MBA Quartermasters",
  MA: "MA Navigators",
  "M.Sc & M.Sc. Tech": "M.Sc & M.Sc. Tech Navigators",
  "M.Sc. & M.Sc. Tech": "M.Sc. & M.Sc. Tech Navigators",
  "Executive Masters Programmes": "Executive Masters Voyages",
  FAQ: "Frequently Asked Sea Questions",
  "Centenary Appeal": "Centenary Treasure Appeal",
  "Alumni Portal": "Old Salts’ Portal",
  "Alumni Insurance Program": "Old Salts’ Insurance Cover",
  "CE&O": "CE&O Voyages",
  "Faculty Portal": "Officers’ Portal",
  "All Faculty": "All the Officers",
  "Hand Book": "Officers’ Handbook",
  Forms: "Forms & Ship’s Paperwork",
  "In Media": "In the Ship’s Gazette",
  "Institute Video": "The Isle on Film",
  "Institute video": "The Isle on Film",
  "Students’ Welfare": "Deckhands’ Welfare",
  "ARK Portal": "ARK Boarding Portal",
  Sustainability: "Keep the Isle Afloat",
  "The Institute": "The Isle",
  Overview: "Survey the Isle",
  "Vision & Mission": "Our Bearings & Mission",
  History: "The Isle’s Old Logs",
  Administration: "The Quarterdeck",
  "Professor In-Charge": "Officer in Charge",
  "Professor In Charge": "Officer in Charge",
  "General Administration": "Quarterdeck Administration",
  Reports: "Ship’s Reports",
  "ARIIA Report": "ARIIA Fleet Report",
  "Institute of Technology Act, 1961": "The Institute’s Charter Act, 1961",
  "IIT Council Data": "IIT Admiralty Data",
  "Statutes of IIT(ISM)": "The Isle’s Statutes",
  "Minutes of BoG": "Admiralty Meeting Logs",
  "Minutes of BoG Meeting": "Admiralty Meeting Logs",
  Academics: "The Learning Deck",
  "AI Courses": "AI Navigator Courses",
  Innovation: "Inventors’ Outpost",
  "International Relations": "Across the Seven Seas",
  "Faculty & Staff Opening": "Recruitin’ Officers & Crew",
  "Non Faculty": "Crew Recruitment",
  "Project Opening": "Expedition Openings",
  "Centenary Events": "Centenary Celebrations",
  "IIT(ISM) @2026; 100 Years of legacy":
    "IIT(ISM) @2026; 100 Years o’ Treasure",
  Seminar: "Seminar on Deck",
  Newsletter: "News from the Decks",
  MoTA: "MoTA Support Outpost",
  CSM: "CSM Outpost",
  "Rain Water Harvesting": "Rainwater Treasure Catchin’",
  "Solid Waste Management": "Keep the Decks Clean",
  IInvenTiv2026: "IInvenTiv2026 Inventors’ Armada",
  Policy: "The Ship’s Policy",
  "Central Library": required("Library"),
  "Right to Information": "Right to Information — Know Yer Rights",
  "National Ragging Prevention Programme":
    "National Ragging Prevention — Safe Decks",
  CVO: "CVO Vigilance Watch",
  "BIS Corner": "BIS Standards Corner",
  "SC/ST Cell": "SC/ST Support Cell",
  "Equal Opportunity Cell": "Equal Opportunity Support Cell",
  "Admission Guideline and Fee Structure of Foreign Student":
    "Foreign Deckhands’ Admission Guidelines & Doubloons",
  "Campus Tour": "Tour the Isle",
  "Study in India": "Study in India, Matey",
  "Student Verification": "Verify a Deckhand",
  "Contingency Rules/Guidelines for Ph.D/M.Tech/ IPDF students":
    "Contingency Rules for Ph.D/M.Tech/IPDF Deckhands",
  "Health Centre": "Health Centre — Crew Care",
  "GJLT Booking": "Book the GJLT Deck",
  Donation: "Add to the Treasure Chest",
  "Quick Links/Resources": "Charts & Useful Scrolls",
  "User Visit:": "Visitors aboard:",
  Search: "Search the Ship’s Charts",
  "IIT(ISM) Search": "Search the Isle",
  Close: "Stow this Panel",
  "Accessibility Menu": "Accessible Deck Controls",
  "Contrast +": "Stronger Ink Contrast",
  "Bigger Text": "Larger Letters, Matey",
  "Reset Text": "Reset the Lettering",
  "Smaller Text": "Smaller Letters, Matey",
  Hindi: "Hindi Tongue",
  English: "English Tongue",
  Twitter: "Twitter / X Lookout",
  Linkedin: "LinkedIn Crew Network",
  Instagram: "Instagram Ship’s Album",
  Facebook: "Facebook Crew Board",
  Youtube: "YouTube Ship’s Cinema",
};
const added: Array<{ original: string; pirate: string }> = [];
function pirate(label: string) {
  const value = aliases[label] ?? terms.get(label) ?? `${label} Deck`;
  if (!terms.has(label)) {
    terms.set(label, value);
    glossary.push({ original: label, pirate: value });
    added.push({ original: label, pirate: value });
  }
  return terms.get(label)!;
}
type Node = { id: string; label: string; href: string; children: Node[] };
function nodes(list: Parameters<typeof $>[0], prefix: string): Node[] {
  return $(list)
    .children("li")
    .toArray()
    .map((li, index) => {
      const a = $(li).children("a").first();
      const id = `${prefix}-${index}`;
      return {
        id,
        label: clean(a),
        href: a.attr("href") ?? "#",
        children: nodes($(li).children("ul").first(), id),
      };
    });
}
function flatNodes(selector: string, prefix: string): Node[] {
  return $(selector)
    .toArray()
    .map((a, index) => ({
      id: `${prefix}-${index}`,
      label: clean(a),
      href: $(a).attr("href") ?? "#",
      children: [],
    }));
}
function rewrite(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(rewrite);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      [
        "label",
        "heading",
        "title",
        "placeholder",
        "buttonLabel",
        "closeLabel",
      ].includes(key) && typeof entry === "string"
        ? pirate(entry)
        : rewrite(entry),
    ]),
  );
}
const brand = {
  name: required("IIT (ISM) Dhanbad") ? "IIT (ISM) Dhanbad" : "",
  subtitle: "Indian School of Mines",
  imageId: "global-header-identity",
};
const desktopRows = $("header nav")
  .toArray()
  .map((nav, index) =>
    nodes($(nav).children("ul").first(), `desktop-${index}`),
  );
const mobileItems = $(".stellarnav .accordion-item")
  .toArray()
  .map((item, index) => {
    const heading = $(item)
      .children(".accordion-header")
      .find("a,button")
      .first();
    return {
      id: `mobile-${index}`,
      label: clean(heading),
      href: heading.attr("href") ?? "#",
      children: nodes(
        $(item).find(".accordion-body > ul").first(),
        `mobile-${index}`,
      ),
    };
  });
const controls = $(".uwaw .line-icons li")
  .toArray()
  .map((li, index) => {
    const a = $(li).children("a");
    return {
      id: a.attr("id") ?? `language-${index}`,
      label: clean(a),
      href: a.attr("href") ?? null,
    };
  });
const header = {
  sourceUrl,
  brand,
  desktopRows,
  mobileItems,
  quickLinks: flatNodes("#megaModal .modal-body a", "quick"),
  quickHeading: clean($("footer .foot-link h4")),
  socialLinks: flatNodes("nav.social-float a", "social"),
  accessibility: { heading: clean($("#uwaw-header")), controls },
  search: {
    title:
      clean($("#searchModal h5")) || clean($("#searchModal")).split(" ")[0],
    placeholder:
      $(".stellarnav input[name='search']").attr("placeholder") ?? "",
    buttonLabel: clean($(".stellarnav button[type='submit']")),
    closeLabel: $("#megaModal button").attr("aria-label") ?? "",
  },
};
const footer = {
  sourceUrl,
  heading: clean($("footer .foot-link h4")),
  resources: flatNodes("footer .foot-link li a", "resource"),
  brand: { ...brand, imageId: "global-footer-identity" },
  actions: flatNodes("footer .btn a", "action"),
  badges: [
    { imageId: "global-parrot-badge" },
    { imageId: "global-treasure-seal" },
  ],
  badgeSourceLabel: $("footer .stqc-badge").attr("data-bs-title") ?? "",
  visit: { label: "User Visit:", value: "—" },
};
const headerPirate = rewrite(header) as typeof header;
headerPirate.brand.name = first("Short name");
headerPirate.brand.subtitle = required("Indian School of Mines");
headerPirate.quickHeading = pirate(header.quickHeading);
const footerPirate = rewrite(footer) as typeof footer;
footerPirate.brand.name = first("Short name");
footerPirate.brand.subtitle = required("Indian School of Mines");
footerPirate.badgeSourceLabel =
  "Decorative pirate seal; no official certification.";
mkdirSync("content/global", { recursive: true });
writeFileSync(
  "content/global/header.json",
  JSON.stringify({ original: header, pirate: headerPirate }, null, 2) + "\n",
);
writeFileSync(
  "content/global/footer.json",
  JSON.stringify({ original: footer, pirate: footerPirate }, null, 2) + "\n",
);
writeFileSync(
  "content/glossary.json",
  JSON.stringify(glossary, null, 2) + "\n",
);
mkdirSync("docs/assets", { recursive: true });
const additionsFile = "docs/assets/global-glossary-additions.json";
const previousAdditions: Array<{ original: string; pirate: string }> =
  existsSync(additionsFile)
    ? JSON.parse(readFileSync(additionsFile, "utf8"))
    : [];
const mergedAdditions = new Map(
  [...previousAdditions, ...added].map((term) => [term.original, term]),
);
writeFileSync(
  additionsFile,
  JSON.stringify([...mergedAdditions.values()], null, 2) + "\n",
);
const manifest = extractImages(doc.html, sourceUrl);
manifest.images = manifest.images.filter((entry) => {
  const context = entry.context as Array<{ tag: string; id: string | null }>;
  return context.some(
    (parent) =>
      parent.tag === "header" ||
      parent.tag === "footer" ||
      parent.id === "megaModal" ||
      parent.id === "userwayAccessibilityIcon",
  );
});
mkdirSync("scrape/images/global", { recursive: true });
writeFileSync(
  "scrape/images/global/manifest.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  `Extracted ${desktopRows.map((row) => row.length).join("+")} desktop groups, ${mobileItems.length} mobile groups, ${header.quickLinks.length} quick links, ${footer.resources.length} footer resources; ${added.length} glossary additions.`,
);
