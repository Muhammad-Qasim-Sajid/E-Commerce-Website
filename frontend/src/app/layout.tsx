import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Greatness - Luxury Watches Collections",
    template: "%s | Greatness Luxury Watches",
  },
  description:
    "Discover exquisite luxury watches at Greatness. Shop authentic Swiss timepieces, designer collections, and premium watch brands.",
  authors: [{ name: "Muhammad Qasim" }],
  creator: "Muhammad Qasim",
  publisher: "Greatness",
  metadataBase: new URL("https://greatness-watches.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Greatness - Luxury Watches Collections",
    description:
      "Explore authentic Swiss luxury watches and premium designer timepieces.",
    type: "website",
    locale: "en_PK",
    url: "https://greatness-watches.vercel.app",
    siteName: "Greatness Luxury Watches",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Greatness Luxury Watch Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Greatness - Luxury Watches Collections",
    description:
      "Authentic Swiss luxury watches. Premium brands. Verified quality.",
    images: ["/og-image.jpg"],
    creator: "@greatness",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "E-commerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.png" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#1a1a1a" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Schema.org structured data for rich snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "Greatness - Luxury Watches",
              description: "Premium luxury watch store offering authentic Swiss timepieces and designer collections",
              url: "https://greatness-watches.vercel.app",
              logo: "https://greatness-watches.vercel.app/favicon.png",
              image: "https://greatness-watches.vercel.app/og-image.jpg",
              priceRange: "$$$",
              address: {
                "@type": "PostalAddress",
                "streetAddress": "CHAK No 91-6R",
                "addressLocality": "Sahiwal",
                "addressRegion": "Punjab",
                "addressCountry": "PK",
              },
              sameAs: [
                "https://www.instagram.com/qasim__codes/",
                "https://x.com/Qasim_Codes",
              ],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}