import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export const metadata: Metadata = {
  title: "Chatbot IA para Restaurantes | Reservas Automáticas | asistencia.io",
  description:
    "Asistente virtual con IA para restaurantes. Reservas automáticas, gestión de alergias, confirmaciones y recordatorios. Sin llamadas. Primer mes gratis.",
  keywords: [
    "chatbot restaurante reservas",
    "reservas automaticas restaurante",
    "IA para restaurantes",
    "automatizar reservas hosteleria",
    "chatbot hosteleria",
    "gestion alergias restaurante",
  ],
  alternates: { canonical: "/sectores/restaurantes" },
};

export default function RestaurantesPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
              🍽️ Solución para Restaurantes
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Reservas automáticas
              <br />
              <span className="gradient-text">mientras cocinas</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Tu asistente IA gestiona reservas 24/7, recoge información de alergias, envía
              confirmaciones y recordatorios. El equipo de sala se centra en la experiencia del
              comensal, no en contestar el teléfono.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contacto#demo"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-indigo-200"
              >
                Demo para restaurantes →
              </Link>
              <a
                href="https://wa.me/34613040895"
                className="border-2 border-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all"
              >
                Hablar por WhatsApp
              </a>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { num: "100%", label: "reservas captadas" },
              { num: "35%", label: "reducción no-shows" },
              { num: "5h", label: "semanales ahorradas" },
              { num: "24/7", label: "reservas online" },
            ].map((r) => (
              <div key={r.num} className="text-center p-4 bg-white rounded-2xl shadow-sm border border-orange-100">
                <div className="text-3xl font-extrabold text-orange-500 mb-1">{r.num}</div>
                <div className="text-xs text-gray-500">{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Tu mejor anfitrión digital
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "📱",
                title: "Reservas por WhatsApp y web",
                desc: "El cliente hace su reserva por WhatsApp, Instagram o tu web. Sin llamadas. Sin esperas. Confirmación instantánea.",
              },
              {
                icon: "🥜",
                title: "Gestión de alergias e intolerancias",
                desc: "Recoge alergias y preferencias alimentarias en la reserva. Tu cocina recibe la información antes del servicio.",
              },
              {
                icon: "🔔",
                title: "Confirmaciones y recordatorios",
                desc: "Recordatorio automático 24h antes. Si el cliente no puede venir, lo cancela y el hueco se libera para otro comensal.",
              },
              {
                icon: "🎂",
                title: "Menús especiales y celebraciones",
                desc: "¿Cumpleaños, aniversario, menú de empresa? El asistente recoge los detalles y pasa la información al equipo de sala.",
              },
              {
                icon: "📊",
                title: "Control del aforo en tiempo real",
                desc: "El asistente conoce tu disponibilidad de mesas en tiempo real y solo acepta reservas cuando hay hueco.",
              },
              {
                icon: "⭐",
                title: "Solicitud de reseñas post-visita",
                desc: "Tras la visita, el asistente envía un mensaje de agradecimiento e invita al comensal a dejar una reseña en Google.",
              },
            ].map((f) => (
              <div key={f.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 card-hover">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Llena tu restaurante sin coger el teléfono
          </h2>
          <p className="text-orange-100 text-lg mb-8">
            Demo gratuita adaptada a tu restaurante. Implementación en 1 semana.
          </p>
          <Link
            href="/contacto#demo"
            className="bg-white text-orange-700 font-bold px-10 py-4 rounded-xl text-lg hover:bg-orange-50 transition-all hover:scale-105 inline-block"
          >
            Solicitar demo gratuita →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
