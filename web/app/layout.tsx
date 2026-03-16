import type { Metadata } from "next";
import "./globals.css";
import CookieConsent from "../components/CookieConsent";

export const metadata: Metadata = {
  title: "Fincahub | Gestion de Comunidades Inteligente",
  description:
    "La plataforma definitiva para presidentes y vecinos. Gestion contable, incidencias, votaciones online y comunicacion para comunidades de propietarios.",
  keywords: [
    "gestion comunidades",
    "comunidad de propietarios",
    "administracion de fincas",
    "votaciones online",
    "contabilidad comunidad",
    "incidencias comunidad",
    "reserva espacios comunes",
    "software comunidades",
    "fincahub",
  ],
  authors: [{ name: "FincaHub S.L." }],
  metadataBase: new URL("https://fincahub.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Fincahub | Gestion de Comunidades Inteligente",
    description:
      "La plataforma definitiva para presidentes y vecinos. Gestion contable, incidencias, votaciones online y comunicacion sin complicaciones.",
    type: "website",
    url: "https://fincahub.vercel.app",
    locale: "es_ES",
    siteName: "Fincahub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fincahub | Gestion de Comunidades Inteligente",
    description:
      "La plataforma definitiva para presidentes y vecinos. Gestion contable, incidencias, votaciones online y comunicacion sin complicaciones.",
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
    <html lang="es">
      <body className="antialiased">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
