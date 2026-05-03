import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono, Montserrat } from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: '--font-serif',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-mono',
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: '--font-montserrat',
});

const title = "On-Call CTO | Macao's Fractional Technical Team";
const description =
  "Macao's part-time CTO service. We fix slow websites, broken tracking, and deploy AI automation — one day a week, in your office. Book a free 20-minute technical health check.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  title: {
    default: title,
    template: "%s | On-Call CTO",
  },
  description,
  keywords: [
    "fractional CTO Macao",
    "part-time CTO Macao",
    "Macao technical consultant",
    "technical debt",
    "AI automation Macao",
    "server-side tracking",
    "Meta CAPI",
    "Google Tag Manager server-side",
    "Macao SME technology",
  ],
  openGraph: {
    type: "website",
    locale: "en_MO",
    url: "/",
    siteName: "On-Call CTO",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${montserrat.variable} scroll-smooth`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
