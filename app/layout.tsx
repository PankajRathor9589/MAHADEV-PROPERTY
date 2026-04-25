import type { Metadata } from "next";
import type { ReactNode } from "react";

const siteUrl = "https://www.sagar-infra.in";
const defaultTitle = "Sagar Infra \u2013 Plots, Homes & Shops";
const description = "Buy plots, homes & shops with Sagar Infra. Contact Prashant Rathor (7692016188).";
const ogImage = `${siteUrl}/og-image.svg`;

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sagar Infra",
  telephone: "+917692016188",
  url: siteUrl,
  sameAs: []
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Sagar Infra"
  },
  description,
  alternates: {
    canonical: siteUrl
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  verification: {
    google: "3HTweA4yjZQY0k..."
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Sagar Infra",
    title: defaultTitle,
    description,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Sagar Infra"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description,
    images: [ogImage]
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
