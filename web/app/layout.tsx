import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fincahub | Gestión de Comunidades Inteligente",
  description: "La plataforma definitiva para presidentes y vecinos. Gestión contable, incidencias y comunicación sin gravedad.",
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
      </body>
    </html>
  );
}
