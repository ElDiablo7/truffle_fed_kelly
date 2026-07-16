import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  ...(siteUrl
    ? {
        metadataBase: new URL(siteUrl),
        alternates: { canonical: "/" },
      }
    : {}),
  title: {
    default: "Truffle Fed by Kelly Stopher | Luxury Snail Caviar & Skincare",
    template: "%s | Truffle Fed",
  },
  description:
    "Discover Truffle Fed by Kelly Stopher: rare truffle-fed snail caviar, Émeraude Noire, White Gold Escargot Elite and a refined snail-derived face-mask ritual.",
  keywords: [
    "truffle-fed snail caviar",
    "luxury escargot caviar",
    "snail caviar UK",
    "Émeraude Noire",
    "White Gold Escargot Elite",
    "Kelly Stopher",
    "snail-derived face mask",
    "luxury snail skincare",
  ],
  authors: [{ name: "Kelly Stopher" }],
  creator: "Kelly Stopher",
  publisher: "Truffle Fed",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Truffle Fed by Kelly Stopher",
    title: "Truffle Fed | Born from truffle. Crafted into rarity.",
    description:
      "A rare luxury house for truffle-fed escargot caviar and a refined snail-derived skincare ritual.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Truffle Fed by Kelly Stopher",
    description: "Truffle-fed snail caviar and a refined luxury skincare ritual.",
  },
  other: {
    "theme-color": "#07170f",
  },
  icons: {
    icon: "/assets/white-gold-escargot.webp",
    shortcut: "/assets/white-gold-escargot.webp",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Truffle Fed",
      founder: { "@type": "Person", name: "Kelly Stopher" },
      description:
        "A luxury house creating truffle-fed snail caviar and a snail-derived skincare ritual.",
      brand: [
        { "@type": "Brand", name: "Émeraude Noire" },
        { "@type": "Brand", name: "White Gold Escargot Elite" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is snail caviar?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Snail caviar, also known as escargot caviar or escargot pearls, is the roe of land snails and is regarded as a rare culinary speciality.",
          },
        },
        {
          "@type": "Question",
          name: "Does Truffle Fed welcome trade enquiries?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Truffle Fed welcomes enquiries from chefs, hospitality businesses, retailers, spas, beauty professionals and the press.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
