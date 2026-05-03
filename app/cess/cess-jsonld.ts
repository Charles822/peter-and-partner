import { getSiteUrl } from "@/lib/site-url";

const OFFICIAL_CEF =
  "https://apps.dsej.gov.mo/cesspublic/public/2023/search.jsp";

export const CESS_METADATA_TITLE = "CEF course search (unofficial)";
export const CESS_METADATA_DESCRIPTION =
  "Keyword search for Macao continuing education (PDAC / CEF) courses — unofficial mirror for English speakers. Built by On-Call CTO; verify all details on the official DSEDJ site.";

/** Matches rendered SERP / Open Graph title (title template from root layout). */
export const CESS_OG_TITLE = `${CESS_METADATA_TITLE} | On-Call CTO`;

export function cessFaqItems(): { question: string; answer: string }[] {
  return [
    {
      question: "What is this CEF / PDAC course search?",
      answer:
        "It is an unofficial English-friendly keyword and filter search over mirrored continuing-education course listings from Macao’s PDAC-style data. Enrollment, quotas, and fees are always authoritative on the official DSEDJ continuing education (CEF) portal.",
    },
    {
      question: "Is this the official DSEDJ website?",
      answer:
        "No. Use this page as a convenience aid. Before registering, confirm course numbers, dates, fees, and availability on the official government search portal.",
    },
    {
      question: "How do I search for courses?",
      answer:
        "Enter a keyword (optional), choose a category or location filter if helpful, then Search. Results show up to 20 courses per page with pagination. On first visit you may see a starting sample by category.",
    },
    {
      question: "Where is the official continuing education portal?",
      answer: `The official public search is published by DSEDJ at ${OFFICIAL_CEF}.`,
    },
  ];
}

export function cessJsonLd(): Record<string, unknown> {
  const base = getSiteUrl().replace(/\/$/, "");
  const cessUrl = `${base}/cess`;
  const faqItems = cessFaqItems();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${cessUrl}#webpage`,
        url: cessUrl,
        name: CESS_OG_TITLE,
        description: CESS_METADATA_DESCRIPTION,
        isPartOf: {
          "@type": "WebSite",
          name: "On-Call CTO",
          url: base,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${cessUrl}#faq`,
        mainEntity: faqItems.map((item, i) => ({
          "@type": "Question",
          "@id": `${cessUrl}#faq-q${i}`,
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}
