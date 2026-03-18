import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "asistencia.io | IA que entiende a tus clientes",
    template: "%s | asistencia.io",
  },
  description:
    "Asistente virtual con IA para empresas. Chatbot web, agente de voz y WhatsApp 24/7. Automatiza la atención al cliente, agenda citas y cualifica leads. Primer mes gratis.",
  keywords: [
    "chatbot para empresas",
    "agente de voz inteligencia artificial",
    "automatizacion de procesos con IA",
    "chatbot whatsapp empresa",
    "asistente virtual para negocios",
    "inteligencia artificial para pymes",
    "chatbot clinica dental",
    "chatbot inmobiliaria",
    "chatbot despacho abogados",
    "automatizar atencion al cliente",
    "agencia inteligencia artificial espana",
    "agencia IA Granada",
    "chatbot empresas Granada",
    "asistencia.io",
  ],
  authors: [{ name: "Jorge Fernández Águila" }],
  creator: "asistencia.io",
  publisher: "asistencia.io",
  metadataBase: new URL("https://asistencia.io"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "asistencia.io | La IA que atiende a tus clientes 24/7",
    description:
      "Chatbot web, WhatsApp y agente de voz con IA. Automatiza la atención al cliente, agenda citas y cualifica leads. Sin permanencia. Primer mes gratis.",
    type: "website",
    url: "https://asistencia.io",
    locale: "es_ES",
    siteName: "asistencia.io",
  },
  twitter: {
    card: "summary_large_image",
    title: "asistencia.io | IA que atiende a tus clientes 24/7",
    description:
      "Chatbot web, WhatsApp y agente de voz. Automatiza tu atención al cliente con IA. Primer mes gratis.",
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
  category: "software",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "asistencia.io",
  url: "https://asistencia.io",
  telephone: "+34613040895",
  email: "info@asistencia.io",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Granada",
    addressRegion: "Andalucía",
    addressCountry: "ES",
  },
  description:
    "Agencia especializada en asistentes virtuales con IA para empresas. Chatbots web, WhatsApp y agentes de voz que atienden a tus clientes 24/7.",
  priceRange: "€€",
  sameAs: ["https://www.linkedin.com/company/asistencia-io"],
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
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
