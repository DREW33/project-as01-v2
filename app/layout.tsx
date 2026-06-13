import type { Metadata } from "next";
import { Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

const siteUrl = "https://projectas01.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Project AS01 — #1 Website & App Development Company in Assam | AI Solutions",
    template: "%s | Project AS01 — Web Development Assam",
  },
  description:
    "Project AS01 is Assam's premium website & app development company based in Guwahati. Custom websites, mobile apps, AI automation, e-commerce, CRM and enterprise software for businesses across Assam and Northeast India. Free consultation — AI agent calls you in 60 seconds.",
  keywords: [
    "website development company in Assam",
    "web development Guwahati",
    "app development company Assam",
    "website designer in Guwahati",
    "AI automation Assam",
    "e-commerce website Assam",
    "software company in Guwahati",
    "mobile app developer Northeast India",
    "best web developer Assam",
    "AI calling agent India",
    "custom software Assam",
    "Project AS01",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Project AS01",
    title: "Project AS01 — We Build Websites, Apps & AI Solutions",
    description:
      "Custom websites, mobile apps, AI automation, prediction platforms, gaming systems & enterprise software.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Project AS01" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Project AS01 — Websites, Apps & AI Solutions",
    description:
      "Premium AI-powered website & app development. Coffee > Code > Repeat.",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteUrl}/#business`,
  name: "Project AS01",
  alternateName: "Project AS01 — Web & App Development Company in Assam",
  url: siteUrl,
  logo: `${siteUrl}/logo.webp`,
  image: `${siteUrl}/logo.webp`,
  description:
    "Premium AI-powered website & app development company in Guwahati, Assam. Custom websites, mobile apps, AI automation, prediction platforms, gaming systems & enterprise software for businesses across Assam and Northeast India.",
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Guwahati",
    addressRegion: "Assam",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: 26.1445, longitude: 91.7362 },
  areaServed: [
    { "@type": "State", name: "Assam" },
    { "@type": "City", name: "Guwahati" },
    { "@type": "City", name: "Dibrugarh" },
    { "@type": "City", name: "Silchar" },
    { "@type": "City", name: "Jorhat" },
    { "@type": "City", name: "Tezpur" },
    { "@type": "Country", name: "India" },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "hello@projectas01.com",
    availableLanguage: ["English", "Hindi", "Assamese"],
  },
  knowsAbout: [
    "Website Development",
    "Mobile App Development",
    "AI Automation",
    "E-Commerce Development",
    "Custom Software",
    "CRM Systems",
  ],
  sameAs: ["https://instagram.com/project_as01"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${grotesk.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
