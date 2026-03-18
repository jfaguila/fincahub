import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "asistencia.io | IA que atiende a tus clientes 24/7",
  description:
    "Asistente virtual con IA para empresas. Chatbot web, WhatsApp y agente de voz que atiende a tus clientes 24/7, cualifica leads y agenda citas automáticamente. Primer mes gratis.",
  alternates: { canonical: "/" },
};

const features = [
  {
    icon: "🤖",
    title: "Atención 24/7 sin descanso",
    desc: "Tu asistente nunca duerme. Atiende consultas por web, WhatsApp y teléfono a las 3 de la mañana con la misma calidad que a las 10 del mediodía.",
  },
  {
    icon: "🎯",
    title: "Cualificación automática de leads",
    desc: "Filtra clientes potenciales según tus criterios. Solo llegan a ti las consultas que valen la pena, con toda la información ya recogida.",
  },
  {
    icon: "📅",
    title: "Agendamiento automático",
    desc: "El cliente reserva su cita directamente en tu calendario. Sin llamadas de ida y vuelta. Sin secretaria a tiempo completo.",
  },
  {
    icon: "📄",
    title: "Documentación previa al cliente",
    desc: "El asistente solicita y envía automáticamente todos los documentos necesarios antes de la primera cita. Primera reunión 100% productiva.",
  },
  {
    icon: "🔗",
    title: "Integración con tu CRM",
    desc: "Se conecta con HubSpot, Salesforce, Google Calendar, Outlook y más de 100 herramientas que ya usas en tu empresa.",
  },
  {
    icon: "📊",
    title: "Analytics e informes",
    desc: "Dashboard en tiempo real con conversaciones, leads cualificados, tasas de conversión y ROI. Decisiones basadas en datos.",
  },
];

const sectors = [
  {
    icon: "⚖️",
    name: "Despachos de Abogados",
    desc: "Capta el 35% más de clientes filtrando consultas 24/7 por tipo de caso.",
    href: "/sectores/abogados",
    color: "bg-blue-50 border-blue-100",
    iconBg: "bg-blue-100",
  },
  {
    icon: "🦷",
    name: "Clínicas Dentales",
    desc: "Gestiona citas, recordatorios y triaje de urgencias automáticamente.",
    href: "/sectores/clinicas-dentales",
    color: "bg-cyan-50 border-cyan-100",
    iconBg: "bg-cyan-100",
  },
  {
    icon: "🏠",
    name: "Inmobiliarias",
    desc: "Cualifica compradores e inquilinos y agenda visitas de forma automática.",
    href: "/sectores/inmobiliarias",
    color: "bg-amber-50 border-amber-100",
    iconBg: "bg-amber-100",
  },
  {
    icon: "🍽️",
    name: "Restaurantes",
    desc: "Reservas automáticas, confirmaciones y gestión de alergias sin esfuerzo.",
    href: "/sectores/restaurantes",
    color: "bg-orange-50 border-orange-100",
    iconBg: "bg-orange-100",
  },
  {
    icon: "💼",
    name: "Servicios Profesionales",
    desc: "Asesores, consultores y coaches: automatiza la captación de clientes.",
    href: "/sectores/servicios-profesionales",
    color: "bg-purple-50 border-purple-100",
    iconBg: "bg-purple-100",
  },
  {
    icon: "🏥",
    name: "Sector Salud",
    desc: "Triaje inicial, citas y recordatorios para clínicas y centros médicos.",
    href: "/sectores/servicios-profesionales",
    color: "bg-green-50 border-green-100",
    iconBg: "bg-green-100",
  },
];

const plans = [
  {
    name: "Starter",
    price: "149",
    setup: "GRATIS (primeros 5 clientes)",
    highlight: false,
    features: [
      "1 chatbot web o WhatsApp",
      "Hasta 500 conversaciones/mes",
      "Integración con 1 calendario",
      "Cualificación automática de leads",
      "Panel de analytics básico",
      "Soporte por email",
    ],
    cta: "Empezar gratis",
    note: "Primer mes sin coste · Sin permanencia",
  },
  {
    name: "Profesional",
    price: "299",
    setup: "500 € (gratis con anualidad)",
    highlight: true,
    features: [
      "Chatbot + agente de voz IA",
      "Hasta 2.000 conversaciones/mes",
      "Integración CRM + calendario",
      "Cualificación y scoring avanzado",
      "Documentación automática",
      "Analytics avanzado",
      "Soporte prioritario",
      "Onboarding incluido",
    ],
    cta: "Solicitar demo",
    note: "El más elegido · Mejor relación calidad/precio",
  },
  {
    name: "Enterprise",
    price: "A medida",
    setup: "Desde 500 €/mes",
    highlight: false,
    features: [
      "Soluciones 100% personalizadas",
      "Múltiples agentes y automatizaciones",
      "Integración completa con ERP/CRM",
      "Voz, chat y WhatsApp",
      "SLA garantizado",
      "Account manager dedicado",
      "Formación del equipo incluida",
    ],
    cta: "Hablar con ventas",
    note: "Para empresas con necesidades específicas",
  },
];

const testimonials = [
  {
    name: "Carlos Jiménez",
    role: "Abogado penalista · Granada",
    avatar: "CJ",
    text: "Antes perdíamos el 40% de las consultas fuera de horario. Ahora el asistente las capta todas. En el primer mes recuperamos la inversión multiplicada por cuatro.",
    metric: "4x ROI en el primer mes",
  },
  {
    name: "Marta López",
    role: "Directora · Clínica Dental López",
    avatar: "ML",
    text: "La recepcionista dedicaba 3 horas al día solo a filtrar llamadas. Ahora ese tiempo lo invertimos en los pacientes. El sistema se pagó solo en la primera semana.",
    metric: "15h/semana recuperadas",
  },
  {
    name: "Alejandro Torres",
    role: "CEO · Inmobiliaria Torres & Partners",
    avatar: "AT",
    text: "El chatbot cualifica a los compradores antes de que lleguen a mí. Solo hablo con quien de verdad quiere comprar. Mis cierres han subido un 28% este trimestre.",
    metric: "+28% tasa de cierre",
  },
];

const faqs = [
  {
    q: "¿Cuánto tiempo tarda la implementación?",
    a: "Entre 1 y 2 semanas desde el kickoff. Sin interrumpir tu actividad. El proceso es sencillo: una reunión de 30 minutos para configurar el sistema, y nosotros nos encargamos del resto.",
  },
  {
    q: "¿Necesito conocimientos técnicos?",
    a: "En absoluto. Tú nos dices cómo funciona tu negocio y nosotros configuramos todo. Si necesitas cambiar algo, nos lo dices y lo hacemos en menos de 24 horas.",
  },
  {
    q: "¿Qué pasa si no estoy satisfecho?",
    a: "El primer mes es gratuito y sin compromiso. Si en 30 días no ves un retorno claro, cancelas sin coste y sin permanencia. Nuestro interés es que funcione.",
  },
  {
    q: "¿Se integra con mi CRM o sistema actual?",
    a: "Sí. Nos integramos con HubSpot, Salesforce, Google Calendar, Outlook, Calendly y más de 100 herramientas. Si usas algo específico, pregúntanos.",
  },
  {
    q: "¿El asistente habla de forma natural?",
    a: "Sí. Usamos los modelos de IA más avanzados para que las conversaciones sean fluidas y naturales. Tus clientes no sabrán que hablan con una IA... a menos que les digas.",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              De Granada al mercado nacional · Plan 2026
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              La IA que{" "}
              <span className="gradient-text">atiende a tus clientes</span>
              <br />
              mientras tú duermes
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Chatbot web, WhatsApp y agente de voz con IA. Automatiza la atención al cliente,
              agenda citas y cualifica leads las 24 horas, los 7 días de la semana.{" "}
              <strong className="text-gray-900">Sin perder ni una consulta.</strong>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/contacto#demo"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-indigo-200"
              >
                Demo gratuita en 15 min →
              </Link>
              <Link
                href="/calculadora"
                className="border-2 border-gray-200 hover:border-indigo-300 text-gray-700 font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:bg-indigo-50"
              >
                Calcular mi ROI
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Primer mes gratis
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Sin permanencia
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Implementación en 2 semanas
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                ROI positivo desde el mes 1
              </span>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { num: "35%", label: "más clientes captados" },
              { num: "15h", label: "semanales ahorradas" },
              { num: "24/7", label: "atención sin interrupciones" },
              { num: "2 sem.", label: "implementación" },
            ].map((stat) => (
              <div key={stat.num} className="text-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="text-3xl font-extrabold text-indigo-600 mb-1">{stat.num}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem / Social proof */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8 max-w-3xl mx-auto text-center">
            <div className="text-4xl mb-4">😰</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              El 73% de las llamadas se pierden fuera de horario
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Cada llamada perdida es un cliente que va a la competencia. En un despacho de 4
              abogados, eso puede suponer{" "}
              <strong className="text-red-600">más de 3.000€ mensuales en ingresos perdidos</strong>.
              Y lo mismo ocurre en clínicas, inmobiliarias, restaurantes y cualquier negocio que
              dependa de la atención al cliente.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Todo lo que necesitas para no perder un solo cliente
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Una plataforma completa que trabaja por ti mientras te centras en lo que de verdad
              importa: hacer crecer tu negocio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 card-hover"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Soluciones específicas para tu sector
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No vendemos una solución genérica. Cada asistente está diseñado con el conocimiento
              específico de tu industria.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((s) => (
              <Link
                key={s.name}
                href={s.href}
                className={`rounded-2xl p-6 border card-hover ${s.color} block`}
              >
                <div className={`w-12 h-12 rounded-xl ${s.iconBg} flex items-center justify-center text-2xl mb-4`}>
                  {s.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{s.desc}</p>
                <span className="text-indigo-600 text-sm font-semibold">Ver solución →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Listo en 2 semanas. Sin complicaciones.
            </h2>
            <p className="text-indigo-200 text-xl max-w-2xl mx-auto">
              Proceso 100% guiado. Solo necesitas 30 minutos de tu tiempo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Demo de 15 min", desc: "Vemos juntos cómo funcionaría en tu negocio específico. Sin compromiso." },
              { step: "2", title: "Kickoff de 30 min", desc: "Reunión de configuración inicial. Tú nos explicas, nosotros configuramos." },
              { step: "3", title: "Implementación", desc: "En 1-2 semanas tu asistente está listo y funcionando. Sin interrumpir tu actividad." },
              { step: "4", title: "Primer mes gratis", desc: "Prueba real sin coste. Si no ves ROI en 30 días, cancelación libre." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-white/20 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-indigo-200 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Resultados reales de clientes reales
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No te contamos lo que podría pasar. Te contamos lo que ya ha pasado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block">
                  {t.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50" id="precios">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Precios transparentes. Sin sorpresas.
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Empiezas gratis. Pagas cuando ves resultados. Sin permanencia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 border-2 relative ${
                  plan.highlight
                    ? "border-indigo-500 bg-indigo-600 text-white shadow-2xl shadow-indigo-200 scale-105"
                    : "border-gray-200 bg-white"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1 rounded-full">
                      MÁS POPULAR
                    </span>
                  </div>
                )}

                <h3 className={`font-bold text-xl mb-2 ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <div className="mb-1">
                  {plan.price === "A medida" ? (
                    <span className={`text-3xl font-extrabold ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                      A medida
                    </span>
                  ) : (
                    <>
                      <span className={`text-4xl font-extrabold ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                        {plan.price}€
                      </span>
                      <span className={`text-sm ${plan.highlight ? "text-indigo-200" : "text-gray-500"}`}>/mes</span>
                    </>
                  )}
                </div>
                <p className={`text-xs mb-6 ${plan.highlight ? "text-indigo-200" : "text-gray-500"}`}>
                  Setup: {plan.setup}
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <svg
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-indigo-200" : "text-indigo-500"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className={plan.highlight ? "text-indigo-100" : "text-gray-700"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contacto#demo"
                  className={`block text-center font-semibold py-3 px-6 rounded-xl transition-all ${
                    plan.highlight
                      ? "bg-white text-indigo-600 hover:bg-indigo-50"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {plan.cta}
                </Link>
                <p className={`text-xs text-center mt-3 ${plan.highlight ? "text-indigo-300" : "text-gray-400"}`}>
                  {plan.note}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              ¿No sabes qué plan necesitas?{" "}
              <Link href="/calculadora" className="text-indigo-600 font-semibold hover:underline">
                Usa nuestra calculadora de ROI
              </Link>{" "}
              o{" "}
              <Link href="/contacto" className="text-indigo-600 font-semibold hover:underline">
                escríbenos
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Preguntas frecuentes
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
            ¿Cuántos clientes pierdes esta semana?
          </h2>
          <p className="text-indigo-200 text-xl mb-10 max-w-2xl mx-auto">
            Solicita una demo gratuita de 15 minutos y descubre exactamente cuánto dinero puede
            ahorrarte y ganar tu negocio con asistencia.io.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contacto#demo"
              className="bg-white text-indigo-600 font-bold px-10 py-4 rounded-xl text-lg hover:bg-indigo-50 transition-all hover:scale-105 shadow-xl"
            >
              Solicitar demo gratis →
            </Link>
            <a
              href="https://wa.me/34613040895"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp directo
            </a>
          </div>
          <p className="text-indigo-300 text-sm mt-6">
            Respuesta garantizada en menos de 2 horas · info@asistencia.io · +34 613 04 08 95
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
