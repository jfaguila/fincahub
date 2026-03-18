import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export const metadata: Metadata = {
  title: "Chatbot IA para Clínicas Dentales | asistencia.io",
  description:
    "Asistente virtual con IA para clínicas dentales. Gestión de citas, recordatorios automáticos, triaje de urgencias y atención al paciente 24/7. Primer mes gratis.",
  keywords: [
    "chatbot clinica dental",
    "IA para dentistas",
    "automatizar citas dentista",
    "asistente virtual clinica dental",
    "recordatorios citas dentales",
    "triaje urgencias dental",
  ],
  alternates: { canonical: "/sectores/clinicas-dentales" },
};

export default function ClinicasDentalesPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
              🦷 Solución para Clínicas Dentales
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Más pacientes, menos
              <br />
              <span className="gradient-text">trabajo administrativo</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Tu asistente IA gestiona citas, envía recordatorios automáticos, realiza triaje de
              urgencias y atiende a pacientes 24/7. Tu equipo se centra en la atención dental.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link
                href="/contacto#demo"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-indigo-200"
              >
                Demo gratuita para clínicas →
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
              { num: "40%", label: "reducción en no-shows" },
              { num: "20h", label: "semanales ahorradas" },
              { num: "24/7", label: "atención al paciente" },
              { num: "3x", label: "ROI en el primer mes" },
            ].map((r) => (
              <div key={r.num} className="text-center p-4 bg-white rounded-2xl shadow-sm border border-cyan-100">
                <div className="text-3xl font-extrabold text-cyan-600 mb-1">{r.num}</div>
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
            Todo lo que necesita tu clínica dental
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "📅",
                title: "Gestión de citas automática",
                desc: "Los pacientes reservan, modifican o cancelan sus citas 24/7 sin llamar a recepción. Integración directa con tu calendario.",
              },
              {
                icon: "🔔",
                title: "Recordatorios automáticos",
                desc: "Recordatorios por WhatsApp, SMS o email 24h y 2h antes de la cita. Reducción del 40% en no-shows.",
              },
              {
                icon: "🚨",
                title: "Triaje de urgencias",
                desc: "El asistente evalúa la urgencia (dolor agudo, trauma, infección) y prioriza o deriva al servicio de urgencias según el protocolo de tu clínica.",
              },
              {
                icon: "📋",
                title: "Historial y anamnesis previa",
                desc: "Recoge alergias, medicaciones y antecedentes antes de la primera cita. Tu equipo llega preparado.",
              },
              {
                icon: "💊",
                title: "Información post-tratamiento",
                desc: "Envía automáticamente las instrucciones de cuidado post-operatorio según el tratamiento realizado.",
              },
              {
                icon: "⭐",
                title: "Solicitud de reseñas automática",
                desc: "Tras cada visita satisfactoria, el asistente invita al paciente a dejar una reseña en Google. Más visibilidad, más pacientes.",
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
      <section className="py-20 bg-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Llena tu agenda sin esfuerzo
          </h2>
          <p className="text-cyan-100 text-lg mb-8">
            Demo gratuita de 15 minutos adaptada a tu clínica dental. Primer mes sin coste.
          </p>
          <Link
            href="/contacto#demo"
            className="bg-white text-cyan-700 font-bold px-10 py-4 rounded-xl text-lg hover:bg-cyan-50 transition-all hover:scale-105 inline-block"
          >
            Solicitar demo gratuita →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
