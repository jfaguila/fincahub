import type { Metadata } from "next";
import "./globals.css";
import CookieConsent from "../components/CookieConsent";

export const metadata: Metadata = {
  title: {
    default: "FincaHub | Software para Comunidades de Vecinos",
    template: "%s | FincaHub",
  },
  description:
    "Software de gestión para comunidades de propietarios. Contabilidad transparente, votaciones online, incidencias, reserva de espacios y portal del vecino. 30 días gratis.",
  keywords: [
    "software gestion comunidades vecinos",
    "app administrador fincas",
    "programa contabilidad comunidad propietarios",
    "votaciones online junta propietarios",
    "gestion incidencias comunidad",
    "reserva espacios comunes",
    "portal vecino online",
    "convocatoria junta propietarios",
    "morosos comunidad vecinos",
    "fincahub",
    "administracion fincas online",
    "software comunidades propietarios espana",
  ],
  authors: [{ name: "FincaHub S.L." }],
  creator: "FincaHub S.L.",
  publisher: "FincaHub S.L.",
  metadataBase: new URL("https://fincahub.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FincaHub | Software para Comunidades de Vecinos",
    description:
      "Contabilidad transparente, votaciones online, incidencias y reservas. Todo en una app. 30 días gratis, sin tarjeta.",
    type: "website",
    url: "https://fincahub.com",
    locale: "es_ES",
    siteName: "FincaHub",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: "FincaHub — Software para comunidades de vecinos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FincaHub | Software para Comunidades de Vecinos",
    description:
      "Contabilidad transparente, votaciones online, incidencias y reservas. Todo en una app. 30 días gratis.",
    images: ["/hero.png"],
  },
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
  verification: {
    google: "REEMPLAZA_CON_TU_ID_GOOGLE_SEARCH_CONSOLE",
  },
  category: "software",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FincaHub",
  url: "https://fincahub.com",
  description:
    "Software de gestión integral para comunidades de propietarios. Contabilidad, votaciones online, incidencias, reservas y portal del vecino.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: [
    {
      "@type": "Offer",
      name: "Plan Básico",
      price: "14.99",
      priceCurrency: "EUR",
      priceValidUntil: "2027-01-01",
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        value: 1,
        unitText: "month",
      },
    },
    {
      "@type": "Offer",
      name: "Plan Profesional",
      price: "29.99",
      priceCurrency: "EUR",
      priceValidUntil: "2027-01-01",
    },
    {
      "@type": "Offer",
      name: "Plan Urbanización",
      price: "59.99",
      priceCurrency: "EUR",
      priceValidUntil: "2027-01-01",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "2400",
    bestRating: "5",
    worstRating: "1",
  },
  inLanguage: "es",
  availableOnDevice: "Desktop, Mobile, Tablet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Metricool */}
        <script
          dangerouslySetInnerHTML={{
            __html: `function loadScript(a){var b=document.getElementsByTagName("head")[0],c=document.createElement("script");c.type="text/javascript",c.src="https://tracker.metricool.com/resources/be.js",c.onreadystatechange=a,c.onload=a,b.appendChild(c)}loadScript(function(){beTracker.t({hash:"b0757668377c082e18bf956e229995be"})});`,
          }}
        />
        {/* Google Analytics 4 — reemplaza G-XXXXXXXXXX con tu Measurement ID */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-XXXXXXXXXX',{page_path:window.location.pathname});`,
          }}
        />
        {/* Crisp Chat — reemplaza XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX con tu website_id */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.$crisp=[];window.CRISP_WEBSITE_ID="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX";(function(){var d=document,s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
