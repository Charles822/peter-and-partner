import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono, Montserrat } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Peter & Partner | Macao's Fractional Tech Team",
  description: "We fix the technical debt that's costing you sales. From broken forms to AI-driven lead filtering, we provide on-call engineering for Macao businesses.",
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
