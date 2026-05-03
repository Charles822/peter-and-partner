import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, Code2 } from "lucide-react";
import { CessSearchClient } from "./CessSearchClient";
import {
  cessFaqItems,
  cessJsonLd,
  CESS_METADATA_DESCRIPTION,
  CESS_METADATA_TITLE,
  CESS_OG_TITLE,
} from "./cess-jsonld";

const CAL_BOOKING_URL = "https://cal.com/charles-fauchet-58ajxq/30min";

export const metadata: Metadata = {
  title: CESS_METADATA_TITLE,
  description: CESS_METADATA_DESCRIPTION,
  robots: { index: true, follow: true },
  keywords: [
    "Macao continuing education",
    "PDAC courses",
    "CEF courses Macao",
    "DSEDJ courses English",
    "Macao PDAC search",
    "continuing education Macao",
  ],
  alternates: {
    canonical: "/cess",
  },
  openGraph: {
    type: "website",
    locale: "en_MO",
    url: "/cess",
    siteName: "On-Call CTO",
    title: CESS_OG_TITLE,
    description: CESS_METADATA_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: CESS_OG_TITLE,
    description: CESS_METADATA_DESCRIPTION,
  },
};

export default function CessPage() {
  const faqItems = cessFaqItems();

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(cessJsonLd()),
        }}
      />
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-[#FAFAFA]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-800 hover:text-black transition-colors font-montserrat font-semibold"
          >
            <span className="bg-black text-white p-1 rounded-md">
              <Code2 className="w-4 h-4" />
            </span>
            On-Call CTO
          </Link>
          <div className="flex items-center gap-4 text-sm font-montserrat">
            <Link href="/" className="text-gray-500 hover:text-black">
              Home
            </Link>
            <a
              href={CAL_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white text-xs px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              Book health check
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 md:py-16 pb-24">
        <div className="mb-10 md:mb-12">
          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">
            Lead tool · Macao residents
          </p>
          <h1 className="text-4xl md:text-5xl font-medium font-serif text-gray-900 tracking-tight mb-4">
            Continuing education course search
          </h1>
          <p className="text-lg text-gray-500 font-montserrat max-w-2xl leading-relaxed">
            Search mirrored PDAC course data by keyword in English. If you do not
            read Chinese or Portuguese, this page can help you find programmes
            faster — always confirm details on the official government portal
            before enrolling.
          </p>
        </div>

        <CessSearchClient />

        <section className="mt-14" aria-labelledby="cess-faq-heading">
          <h2
            id="cess-faq-heading"
            className="text-xl font-medium font-serif text-gray-900 mb-6"
          >
            Questions about this search
          </h2>
          <div className="space-y-3">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-gray-100 bg-gray-50/60 transition-colors open:border-gray-200 open:bg-white hover:bg-gray-50/90 open:hover:bg-white"
              >
                <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-4 font-montserrat font-medium text-gray-900 outline-none [&::-webkit-details-marker]:hidden focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2 rounded-2xl">
                  <ChevronDown
                    className="mt-0.5 h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180"
                    aria-hidden
                  />
                  <span className="text-left">{item.question}</span>
                </summary>
                <div className="border-t border-gray-100 px-4 pb-4 pt-0">
                  <p className="pl-8 text-gray-600 font-montserrat text-sm leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16 pt-12 border-t border-gray-200 text-center">
          <p className="text-gray-600 font-montserrat text-sm mb-4 max-w-xl mx-auto">
            Need integrations, tracking, or automation for your Macao business?
          </p>
          <Link
            href="/#book"
            className="inline-flex text-sm font-montserrat font-medium text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900"
          >
            Talk to On-Call CTO
          </Link>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-8 text-center text-xs text-gray-400 font-mono uppercase tracking-widest">
        © {new Date().getFullYear()} On-Call CTO · Metaverse Consulting · Macao
      </footer>
    </div>
  );
}
