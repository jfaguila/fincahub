import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export const metadata: Metadata = {
  title: "Chatbot IA para Despachos de Abogados | asistencia.io",
  description:
    "Asistente virtual con IA para despachos de abogados. Atiende consultas 24/7, filtra por tipo de caso, agenda citas y envía documentación previa. Primer mes gratis.",
  keywords: [
    "chatbot despacho abogados",
    "asistente IA para abogados",
    "automatizar consultas abogados",
    "software atencion cliente despacho",
    "chatbot juridico",
    "IA para despachos",
    "agente virtual abogados",
  ],
  alternates: { canonical: "/sectores/abogados" },
  openGraph: {
    title: "Chatbot IA para Despachos de Abogados | asistencia.io",
    description:
      "Captura el 35% más de clientes. Atiende consultas 24/7, filtra por tipo de caso y agenda citas automáticamente.",
    url: "https://asistencia.io/sectores/abogados",
  },
};

const problems = [
  { icon: "📵", text: "El 73% de las llamadas se pierden fuera de horario" },
  { icon: "⏰", text: "La secretaria dedica 3h/día a filtrar llamadas irrelevantes" },
  { icon: "📂", text: "Los clientes llegan sin la documentación necesaria a la primera cita" },
  { icon: "💸", text: "Cada consulta perdida = entre 500 y 2.000€ de honorarios potenciales" },
];

const solutions = [
  {
    icon: "🤖",
    title: "Filtrado automático por área legal",
    desc: "El asistente identifica el tipo de caso (civil, penal, laboral, familiar...) y lo cualifica antes de pasar al abogado. Solo recibes las consultas que realmente valen tu tiempo.",
  },
  {
    icon: "📅",
    title: "Agendamiento directo en tu calendario",
    desc: "El cliente elige hora en tu calendario de disponibilidad real. Sin llamadas de ida y vuelta. Sin secretaria dedicada a coordinar fechas.",
  },
  {
    icon: "📋",
    title: "Documentación previa al cliente",
    desc: "El asistente solicita automáticamente DNI, contratos, sentencias o cualquier documento necesario antes de la primera cita. Llegas a la reunión con todo listo.",
  },
  {
    icon: "📞",
    title: "Atención 24/7 por voz, web y WhatsApp",
    desc: "Un potencial cliente llama a las 21:00. Tu asistente atiende, recoge la información, cualifica el caso y agenda. El cliente no va a la competencia.",
  },
];

const results = [
  { num: "35%", label: "más clientes captados" },
  { num: "0%", label: "llamadas perdidas" },
  { num: "15h", label: "semanales recuperadas" },
  { num: "90%", label: "citas productivas (doc. previa)" },
];

const caseStudy = {
  title: "Caso real: Despacho de 4 abogados en Granada",
  before: [
    "40% de llamadas sin contestar (fuera de horario)",
    "Secretaria dedicando 3h/día a filtrar consultas",
    "Clientes sin documentación en la primera cita",
    "~2 leads perdidos/día por falta de atención inmediata",
  ],
  after: [
    "0% de llamadas perdidas — asistente activo 24/7",
    "15h/semana recuperadas en tareas administrativas",
    "Primera cita productiva al 90% — documentación previa",
    "+35% en captación de nuevos clientes",
  ],
  roi: "ROI de 4x en el primer mes. Setup en 2 semanas sin interrumpir la actividad.",
};

const emailSequence = [
  {
    day: "Día 1",
    subject: "¿Cuántas consultas pierde tu despacho fuera de horario?",
    preview:
      "Hemos desarrollado un asistente virtual con IA que atiende llamadas y WhatsApp 24/7 con voz natural, cualifica al cliente por tipo de caso y agenda la cita directamente en vuestro calendario.",
  },
  {
    day: "Día 4",
    subject: "Cómo un despacho en Granada ahorró 15h/semana",
    preview:
      "Un despacho de 4 abogados tenía el 40% de llamadas sin contestar. Después de implementar nuestro sistema: 0% llamadas perdidas y 15h/semana recuperadas.",
  },
  {
    day: "Día 8",
    subject: "Oferta exclusiva para despachos de Granada (5 plazas)",
    preview:
      "Setup e implementación GRATIS + primer mes sin coste. Recepcionista Virtual desde 97€/mes o Pack Completo desde 147€/mes. Solo 5 plazas disponibles.",
  },
];

export default function AbogadosPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
              ⚖️ Solución para Despachos de Abogados
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Tu despacho capta clientes
              <br />
              <span className="gradient-text">a las 3 de la mañana</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Asistente virtual con IA que atiende consultas 24/7, filtra por tipo de caso legal,
              agenda citas directamente en tu calendario y envía documentación previa.{" "}
              <strong className="text-gray-900">Sin perder ni una consulta.</strong>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contacto#demo"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-indigo-200"
              >
                Demo gratuita para despachos →
              </Link>
              <a
                href="https://wa.me/34613040895"
                className="flex items-center gap-2 border-2 border-green-400 text-green-700 font-semibold px-6 py-4 rounded-xl hover:bg-green-50 transition-all"
              >
                <span>WhatsApp directo</span>
              </a>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Primer mes gratis · Sin permanencia · Implementación en 2 semanas
            </p>
          </div>

          {/* Results row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {results.map((r) => (
              <div key={r.num} className="text-center p-4 bg-white rounded-2xl shadow-sm border border-blue-100">
                <div className="text-3xl font-extrabold text-blue-600 mb-1">{r.num}</div>
                <div className="text-xs text-gray-500">{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-12">
              ¿Te identificas con alguno de estos problemas?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {problems.map((p) => (
                <div key={p.text} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
                  <span className="text-2xl flex-shrink-0">{p.icon}</span>
                  <p className="text-gray-700 text-sm font-medium">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              La solución diseñada para despachos de abogados
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No es un chatbot genérico. Es un asistente que entiende el lenguaje jurídico, los
              tipos de casos y cómo funciona un despacho.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solutions.map((s) => (
              <div key={s.title} className="bg-white rounded-2xl p-6 border border-gray-100 card-hover">
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case study */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
              {caseStudy.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2">
                  <span>❌</span> Antes de asistencia.io
                </h3>
                <ul className="space-y-3">
                  {caseStudy.before.map((item) => (
                    <li key={item} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-red-400 flex-shrink-0 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                <h3 className="font-bold text-green-700 mb-4 flex items-center gap-2">
                  <span>✅</span> Después de asistencia.io
                </h3>
                <ul className="space-y-3">
                  {caseStudy.after.map((item) => (
                    <li key={item} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-green-500 flex-shrink-0 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-indigo-600 text-white rounded-2xl p-6 text-center">
              <p className="font-semibold text-indigo-100 text-sm mb-1">Resultado final</p>
              <p className="text-xl font-bold">{caseStudy.roi}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Email sequence preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
                ¿Eres abogado en Granada?
              </h2>
              <p className="text-gray-600">
                Estamos buscando <strong>5 despachos piloto</strong> en Granada con implementación
                gratuita y primer mes sin coste.
              </p>
            </div>

            <div className="space-y-4">
              {emailSequence.map((email) => (
                <div key={email.day} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">
                      {email.day}
                    </span>
                    <span className="font-semibold text-gray-900 text-sm">{email.subject}</span>
                  </div>
                  <p className="text-gray-500 text-sm italic">&ldquo;{email.preview}&rdquo;</p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
              <p className="font-bold text-amber-800 mb-2">⚡ Oferta de lanzamiento — Solo 5 plazas</p>
              <p className="text-amber-700 text-sm mb-4">
                Setup e implementación GRATIS + Primer mes sin coste. Recepcionista Virtual: 97€/mes | Pack Completo (Voz + WhatsApp): 147€/mes
              </p>
              <Link
                href="/contacto#demo"
                className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors inline-block"
              >
                Quiero una de las 5 plazas →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Objections */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-10">
            Tus dudas, respondidas
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Es muy caro para mi despacho",
                a: '¿Cuánto cobras por hora? Si el asistente ahorra 15h/semana de trabajo administrativo a 20€/h, son 1.200€/mes de ahorro. La Recepcionista Virtual cuesta 97€/mes. El ROI es de 12x desde el primer mes. Y si en 30 días no ves resultados: cancelación libre, sin coste.',
              },
              {
                q: "¿El asistente entenderá los términos jurídicos?",
                a: "Sí. Lo configuramos específicamente para tu área de práctica — derecho civil, penal, laboral, familiar, mercantil... El asistente conoce el vocabulario jurídico y sabe qué información recoger para cada tipo de caso.",
              },
              {
                q: "Necesito consultarlo con mi socio",
                a: "Por supuesto. ¿Qué tal si hacemos la demo con ambos? Son solo 15 minutos. Así podéis ver cómo funciona en directo y tomar la decisión juntos con toda la información.",
              },
              {
                q: "¿La confidencialidad de los datos está garantizada?",
                a: "Sí. Todo el sistema cumple con el RGPD y la LOPD. Los datos de los clientes son tuyos. Firmamos un DPA (acuerdo de procesamiento de datos) como encargados del tratamiento.",
              },
            ].map((item) => (
              <div key={item.q} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2 text-sm">💬 &ldquo;{item.q}&rdquo;</h3>
                <p className="text-gray-600 text-sm leading-relaxed">→ {item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            ¿Cuántas consultas perderás esta semana?
          </h2>
          <p className="text-indigo-200 text-lg mb-8 max-w-2xl mx-auto">
            Solicita una demo gratuita y te mostramos exactamente cómo funcionaría el asistente en
            tu despacho. 15 minutos. Sin compromiso.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contacto#demo"
              className="bg-white text-indigo-600 font-bold px-10 py-4 rounded-xl text-lg hover:bg-indigo-50 transition-all hover:scale-105"
            >
              Demo gratuita en 15 min →
            </Link>
            <a
              href="tel:+34613040895"
              className="border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all"
            >
              Llamar ahora: 613 04 08 95
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
