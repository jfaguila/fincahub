import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export const metadata: Metadata = {
  title: "Chatbot IA para Inmobiliarias | asistencia.io",
  description:
    "Asistente virtual con IA para inmobiliarias. Cualifica compradores e inquilinos, agenda visitas y filtra clientes potenciales automáticamente. Primer mes gratis.",
  keywords: [
    "chatbot inmobiliaria",
    "IA para agencias inmobiliarias",
    "automatizar atencion clientes inmobiliaria",
    "cualificar compradores IA",
    "asistente virtual inmobiliaria",
    "chatbot sector inmobiliario",
  ],
  alternates: { canonical: "/sectores/inmobiliarias" },
};

export default function InmobiliariasPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
              🏠 Solución para Inmobiliarias
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Solo hablas con clientes
              <br />
              <span className="gradient-text">que de verdad quieren comprar</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Tu asistente IA cualifica compradores e inquilinos, filtra según presupuesto y zona,
              agenda visitas y responde preguntas sobre propiedades 24/7. Tú cierras ventas,
              nosotros gestionamos los curiosos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contacto#demo"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-indigo-200"
              >
                Demo para inmobiliarias →
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
              { num: "+28%", label: "tasa de cierre" },
              { num: "80%", label: "menos leads irrelevantes" },
              { num: "24/7", label: "atención sin parar" },
              { num: "2x", label: "más visitas agendadas" },
            ].map((r) => (
              <div key={r.num} className="text-center p-4 bg-white rounded-2xl shadow-sm border border-amber-100">
                <div className="text-3xl font-extrabold text-amber-600 mb-1">{r.num}</div>
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
            Cualificación inteligente de clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🎯",
                title: "Cualificación por presupuesto y zona",
                desc: "El asistente filtra automáticamente por presupuesto, zona, tipo de inmueble y necesidades. Solo llegas a los clientes que encajan con tu cartera.",
              },
              {
                icon: "🏡",
                title: "Información de propiedades 24/7",
                desc: "Responde preguntas sobre superficies, precios, características, vecindario y disponibilidad de cualquier propiedad a cualquier hora.",
              },
              {
                icon: "📅",
                title: "Agenda de visitas automática",
                desc: "El cliente elige día y hora para la visita directamente en el calendario del agente disponible. Confirmación y recordatorio automáticos.",
              },
              {
                icon: "💰",
                title: "Pre-cualificación hipotecaria",
                desc: "Pregunta por ingresos, situación laboral y ahorros para estimar la viabilidad hipotecaria antes de que llegue al agente.",
              },
              {
                icon: "📸",
                title: "Envío de documentación",
                desc: "Envía automáticamente dossiers, planos, certificados energéticos y toda la documentación del inmueble según el interés del cliente.",
              },
              {
                icon: "🔄",
                title: "Seguimiento de leads",
                desc: "Reactiva automáticamente contactos que no han respondido. Envía nuevas propiedades cuando encajan con el perfil del cliente.",
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
      <section className="py-20 bg-amber-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Cierra más operaciones con menos esfuerzo
          </h2>
          <p className="text-amber-100 text-lg mb-8">
            Demo gratuita adaptada a tu agencia inmobiliaria. Sin permanencia.
          </p>
          <Link
            href="/contacto#demo"
            className="bg-white text-amber-700 font-bold px-10 py-4 rounded-xl text-lg hover:bg-amber-50 transition-all hover:scale-105 inline-block"
          >
            Solicitar demo gratuita →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
