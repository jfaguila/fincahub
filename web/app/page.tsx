'use client';
import Link from 'next/link';
import { useState } from 'react';

const FEATURES = [
  { icon: '📊', title: 'Cuentas Transparentes', desc: 'Saldo en tiempo real, conciliación bancaria y balance trimestral. Cada euro justificado.' },
  { icon: '🗳️', title: 'Votaciones Online', desc: 'Vota desde el móvil. Sin reuniones interminables. Resultados certificados al instante.' },
  { icon: '🔧', title: 'Gestión de Incidencias', desc: 'Reporta averías con fotos, asigna prioridad y sigue el estado en tiempo real.' },
  { icon: '📢', title: 'Tablón de Anuncios', desc: 'Comunica a todos los vecinos al instante. Sin grupos de WhatsApp caóticos.' },
  { icon: '📅', title: 'Reserva de Espacios', desc: 'Pádel, piscina, sala de reuniones. Sin conflictos, sin libretas.' },
  { icon: '📁', title: 'Gestor Documental', desc: 'Actas, contratos y facturas siempre accesibles. Búsqueda en segundos.' },
  { icon: '⚖️', title: 'Reclamación de Deuda', desc: 'Detecta morosos automáticamente y genera carta de reclamación en un clic.' },
  { icon: '📋', title: 'Convocatorias de Junta', desc: 'Crea y envía convocatorias por email con un clic. Cumple la LPH automáticamente.' },
  { icon: '👥', title: 'Portal del Vecino', desc: 'Cada vecino accede a su historial de pagos, documentos y reservas propias.' },
];

const PLANS = [
  {
    name: 'Básico',
    price: '14,99',
    desc: 'Para comunidades pequeñas',
    features: [
      'Hasta 30 viviendas',
      'Cuentas y contabilidad',
      'Gestión de incidencias',
      'Reserva de espacios',
      'Tablón de anuncios',
      'Gestor documental',
      'Soporte por email',
    ],
    cta: 'Empezar gratis 30 días',
    highlight: false,
  },
  {
    name: 'Profesional',
    price: '29,99',
    desc: 'El más popular',
    features: [
      'Hasta 100 viviendas',
      'Todo lo del plan Básico',
      'Votaciones online',
      'Convocatorias de junta',
      'Reclamación de deuda',
      'Notificaciones por email',
      'Soporte prioritario',
    ],
    cta: 'Empezar gratis 30 días',
    highlight: true,
  },
  {
    name: 'Urbanización',
    price: '59,99',
    desc: 'Para grandes comunidades',
    features: [
      'Viviendas ilimitadas',
      'Todo lo del plan Profesional',
      'Múltiples portales/bloques',
      'Informes avanzados',
      'API de integración',
      'Gestor de proveedores',
      'Soporte telefónico 24/7',
    ],
    cta: 'Contactar ventas',
    highlight: false,
  },
];

const TESTIMONIALS = [
  {
    name: 'Carlos Martínez',
    role: 'Presidente de comunidad, Madrid',
    text: 'Antes tardaba horas en cuadrar las cuentas. Con Fincahub lo tengo todo en 5 minutos. Los vecinos están encantados con la transparencia.',
    avatar: 'CM',
  },
  {
    name: 'Ana García',
    role: 'Administradora de fincas, Barcelona',
    text: 'Gestiono 12 comunidades desde un solo panel. Las votaciones online han eliminado el 90% de las reuniones presenciales.',
    avatar: 'AG',
  },
  {
    name: 'Pedro López',
    role: 'Presidente de urbanización, Valencia',
    text: 'Las convocatorias de junta se envían solas y los vecinos votan desde el móvil. Hemos pasado de 3 juntas al año a resolverlo todo online.',
    avatar: 'PL',
  },
];

const FAQS = [
  {
    q: '¿Necesito instalar algo?',
    a: 'No. Fincahub funciona 100% en el navegador y en el móvil. Sin instalaciones, sin mantenimiento.',
  },
  {
    q: '¿Qué pasa al terminar los 30 días gratis?',
    a: 'Te avisamos antes de que acabe. Si decides continuar, introduces tu tarjeta y sigues sin interrupciones. Si no, no se cobra nada.',
  },
  {
    q: '¿Mis datos están seguros?',
    a: 'Sí. Servidores en Europa, copias de seguridad diarias y cifrado SSL. Cumplimos el RGPD.',
  },
  {
    q: '¿Puedo cambiar de plan en cualquier momento?',
    a: 'Sí, puedes subir o bajar de plan cuando quieras. El cambio es inmediato y se prorratea el mes.',
  },
  {
    q: '¿Hay contrato de permanencia?',
    a: 'Ninguno. Cancelas cuando quieras, sin penalizaciones ni letra pequeña.',
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">

      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">F</div>
            <span className="text-xl font-bold tracking-tight">Fincahub</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Características</a>
            <a href="#pricing" className="hover:text-white transition-colors">Precios</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Opiniones</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          <div className="flex gap-3 items-center">
            <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Acceder
            </Link>
            <Link href="/register" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
              Prueba gratis
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">

        {/* Hero */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
            <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              30 días gratis · Sin tarjeta · Sin permanencia
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              La comunidad de vecinos{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                gestionada sola
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Cuentas claras, votaciones online, incidencias resueltas y vecinos informados.
              Todo en una sola app. Sin hojas de cálculo, sin grupos de WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/register"
                className="h-13 px-8 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/25 hover:-translate-y-0.5"
              >
                Empezar gratis — 30 días sin compromiso
              </Link>
              <Link
                href="/login"
                className="h-13 px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all hover:-translate-y-0.5"
              >
                Ver demo →
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
              {[
                { n: '+2.400', label: 'comunidades activas' },
                { n: '+180.000', label: 'vecinos gestionados' },
                { n: '98%', label: 'satisfacción' },
                { n: '4,9★', label: 'valoración media' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-white">{s.n}</div>
                  <div>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 bg-white/[0.02] border-y border-white/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Todo lo que necesita tu comunidad</h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                Olvídate de las hojas de cálculo y los grupos de WhatsApp. Centraliza todo en un solo lugar.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {FEATURES.map((f, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group">
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Precios claros, sin sorpresas</h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                30 días gratis en todos los planes. Sin tarjeta de crédito. Cancela cuando quieras.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {PLANS.map((plan, i) => (
                <div
                  key={i}
                  className={`relative rounded-2xl p-8 border flex flex-col ${
                    plan.highlight
                      ? 'bg-blue-600 border-blue-500 shadow-2xl shadow-blue-500/25 scale-105'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-black text-xs font-bold rounded-full">
                      MÁS POPULAR
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                    <p className={`text-sm mb-4 ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>{plan.desc}</p>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold">{plan.price}€</span>
                      <span className={`text-sm pb-1 ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>/mes</span>
                    </div>
                  </div>
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <span className={`text-lg ${plan.highlight ? 'text-blue-200' : 'text-green-400'}`}>✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.name === 'Urbanización' ? 'mailto:hola@fincahub.com' : '/register'}
                    className={`block text-center py-3 rounded-xl font-semibold transition-all hover:-translate-y-0.5 ${
                      plan.highlight
                        ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg'
                        : 'bg-blue-600 text-white hover:bg-blue-500'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-500 text-sm mt-8">
              ¿Tienes más de 200 viviendas o necesitas integración personalizada?{' '}
              <a href="mailto:hola@fincahub.com" className="text-blue-400 hover:underline">Contáctanos</a>
            </p>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 bg-white/[0.02] border-y border-white/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Lo que dicen nuestros clientes</h2>
              <p className="text-gray-400">Más de 2.400 comunidades ya confían en Fincahub</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-1 text-yellow-400 mb-4 text-sm">{'★★★★★'}</div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-gray-400 text-xs">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Preguntas frecuentes</h2>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold hover:bg-white/5 transition-colors"
                  >
                    {faq.q}
                    <span className={`text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-24 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-y border-white/10">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-4">¿Listo para simplificar tu comunidad?</h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Únete a más de 2.400 comunidades que ya gestionan todo sin complicaciones. 30 días gratis, sin tarjeta.
            </p>
            <Link
              href="/register"
              className="inline-block px-10 py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/25 hover:-translate-y-1"
            >
              Empezar ahora gratis →
            </Link>
          </div>
        </section>

      </main>

      <footer className="border-t border-white/10 bg-black/40 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">F</div>
              <span className="font-semibold text-white">Fincahub</span>
              <span>© 2026 Fincahub S.L.</span>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacidad</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Términos</Link>
              <a href="mailto:hola@fincahub.com" className="hover:text-white transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
