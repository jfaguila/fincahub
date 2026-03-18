import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export const metadata: Metadata = {
  title: "Chatbot IA para Servicios Profesionales | asistencia.io",
  description:
    "Asistente virtual con IA para asesores, consultores y servicios profesionales. Cualifica leads, agenda reuniones y automatiza la captación de clientes. Primer mes gratis.",
  keywords: [
    "chatbot servicios profesionales",
    "IA para asesores",
    "automatizar captacion clientes consultor",
    "asistente virtual profesionales",
    "chatbot coaches consultores",
  ],
  alternates: { canonical: "/sectores/servicios-profesionales" },
};

export default function ServiciosProfesionalesPage() {
  return (
    <>
      <Header />

      <section className="pt-24 pb-20 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
              💼 Servicios Profesionales
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Automatiza la captación.
              <br />
              <span className="gradient-text">Céntrate en tu expertise.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Para asesores, consultores, coaches, psicólogos y cualquier profesional que venda su
              tiempo. Tu asistente IA cualifica clientes potenciales y agenda reuniones mientras tú
              trabajas.
            </p>
            <Link
              href="/contacto#demo"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-indigo-200 inline-block"
            >
              Demo gratuita de 15 min →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🎯", title: "Cualificación de leads", desc: "Filtra automáticamente por perfil, presupuesto y necesidad. Solo entras en contacto con clientes que realmente son tu target." },
              { icon: "📅", title: "Agenda de discovery calls", desc: "El potencial cliente elige su horario y reserva una llamada inicial directamente en tu calendario. Sin coordinación manual." },
              { icon: "📋", title: "Formulario de onboarding previo", desc: "El asistente recoge toda la información necesaria antes de la primera reunión. Llegas preparado, el cliente percibe profesionalidad." },
              { icon: "💡", title: "Nurturing automático", desc: "Envía contenido de valor (artículos, casos de éxito, guías) a leads que aún no están listos para comprar. Cuando estén listos, pensarán en ti." },
              { icon: "🔄", title: "Seguimiento post-propuesta", desc: "El asistente hace seguimiento automático de propuestas enviadas. No más leads fríos por falta de follow-up." },
              { icon: "📊", title: "Pipeline siempre actualizado", desc: "Todo queda registrado en tu CRM automáticamente. Sabes en qué punto está cada lead en todo momento." },
            ].map((f) => (
              <div key={f.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 card-hover">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Tu funnel en piloto automático</h2>
          <p className="text-purple-200 mb-8">Demo gratuita y personalizada para tu tipo de servicio. Primer mes sin coste.</p>
          <Link href="/contacto#demo" className="bg-white text-purple-700 font-bold px-10 py-4 rounded-xl hover:bg-purple-50 transition-all hover:scale-105 inline-block">
            Solicitar demo →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
