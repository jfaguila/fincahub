import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'App para Comunidades de Vecinos — FincaHub',
  description:
    'La aplicación para gestionar tu comunidad de vecinos: cuentas, votaciones, incidencias, reservas y comunicación. Sin instalaciones. 30 días gratis.',
  alternates: { canonical: '/app-comunidad-vecinos' },
  openGraph: {
    title: 'App para Comunidades de Vecinos — FincaHub',
    description:
      'Gestiona tu comunidad de vecinos desde el móvil: cuentas, votaciones, incidencias y reservas. Prueba gratis 30 días.',
    url: 'https://fincahub.com/app-comunidad-vecinos',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'FincaHub — App para Comunidades de Vecinos',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  description: 'Aplicación web para gestionar comunidades de propietarios en España.',
  url: 'https://fincahub.com/app-comunidad-vecinos',
  offers: { '@type': 'Offer', price: '14.99', priceCurrency: 'EUR' },
};

const PAIN_POINTS = [
  { problema: 'Grupos de WhatsApp incontrolables', solucion: 'Tablón de anuncios oficial. Todos informados, sin ruido.' },
  { problema: 'Cuentas opacas que generan desconfianza', solucion: 'Balance en tiempo real. Cada vecino ve cada euro.' },
  { problema: 'Juntas que no llegan a acuerdos', solucion: 'Votaciones online. Resultados en minutos, sin reunión.' },
  { problema: 'Incidencias que se pierden en emails', solucion: 'Sistema de tickets con foto y estado actualizado.' },
  { problema: 'Conflictos por las reservas del pádel', solucion: 'Calendario digital. Cada vecino reserva su turno.' },
  { problema: 'Morosos que nunca pagan', solucion: 'Detección automática y carta de reclamación en un clic.' },
];

export default function AppComunidadVecinos() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">FincaHub</Link>
        <div className="flex items-center gap-4">
          <Link href="/calculadora" className="text-slate-400 hover:text-white text-sm transition">Calculadora</Link>
          <Link href="/comparativa" className="text-slate-400 hover:text-white text-sm transition">Comparativa</Link>
          <Link href="/login" className="text-slate-400 hover:text-white text-sm transition">Acceder</Link>
          <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition">Empezar gratis</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
          Para presidentes y vecinos
        </div>
        <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6">
          La app que tu comunidad<br />
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">necesitaba desde siempre</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
          Olvídate de los grupos de WhatsApp, las hojas de cálculo y los papeles en el buzón. FincaHub digitaliza tu comunidad en menos de 10 minutos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link href="/register" className="px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg transition shadow-xl shadow-purple-500/20">
            Probar gratis 30 días →
          </Link>
          <Link href="/calculadora" className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition">
            Calcular mi cuota
          </Link>
        </div>
        <p className="text-slate-600 text-sm">Sin tarjeta · Sin permanencia · Para comunidades de 5 a 500 viviendas</p>
      </section>

      {/* Pain points → Solutions */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-black text-center mb-4">¿Te suena alguno de estos problemas?</h2>
        <p className="text-slate-400 text-center mb-12">FincaHub los resuelve todos</p>
        <div className="space-y-4">
          {PAIN_POINTS.map((item) => (
            <div key={item.problema} className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-white/10">
              <div className="bg-red-500/5 border-r border-white/10 p-5 flex items-start gap-3">
                <span className="text-red-400 text-lg mt-0.5 shrink-0">✗</span>
                <p className="text-slate-300 text-sm font-medium">{item.problema}</p>
              </div>
              <div className="bg-green-500/5 p-5 flex items-start gap-3">
                <span className="text-green-400 text-lg mt-0.5 shrink-0">✓</span>
                <p className="text-slate-300 text-sm font-medium">{item.solucion}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-black text-center mb-12">En marcha en 3 pasos</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { n: '1', title: 'Crea tu comunidad', desc: 'Introduce el nombre, dirección y añade las viviendas. Si tienes los datos en Excel, impórtalos directamente.' },
            { n: '2', title: 'Invita a los vecinos', desc: 'Cada vecino recibe un email con su acceso al portal personal. Sin complicaciones técnicas.' },
            { n: '3', title: 'Gestiona todo online', desc: 'Cuentas, incidencias, votaciones, reservas y juntas desde cualquier dispositivo.' },
          ].map((s) => (
            <div key={s.n} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 text-2xl font-black flex items-center justify-center mx-auto mb-4">{s.n}</div>
              <h3 className="font-bold text-white mb-2">{s.title}</h3>
              <p className="text-slate-400 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Precios rápidos */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-white/10 rounded-2xl p-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { name: 'Básico', price: '14,99€/mes', desc: 'Hasta 30 viviendas' },
              { name: 'Profesional', price: '29,99€/mes', desc: 'Hasta 100 viviendas · Más popular', highlight: true },
              { name: 'Urbanización', price: '59,99€/mes', desc: 'Viviendas ilimitadas' },
            ].map((p) => (
              <div key={p.name} className={`rounded-xl p-5 ${p.highlight ? 'bg-purple-600 shadow-lg shadow-purple-500/25' : 'bg-white/5'}`}>
                <p className="font-bold text-white text-lg">{p.name}</p>
                <p className="text-2xl font-black text-white my-2">{p.price}</p>
                <p className={`text-sm ${p.highlight ? 'text-purple-200' : 'text-slate-400'}`}>{p.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-500 text-sm mt-6">Todos incluyen 30 días gratis · Sin tarjeta · Sin permanencia</p>
          <div className="text-center mt-4">
            <Link href="/register" className="inline-block bg-white text-purple-700 font-bold px-8 py-3 rounded-xl text-sm hover:bg-purple-50 transition">
              Empezar gratis →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ rápido */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-black text-center mb-8">Preguntas frecuentes</h2>
        <div className="space-y-4">
          {[
            { q: '¿Funciona en el móvil?', a: 'Sí, la app funciona perfectamente en móvil y tablet. No necesitas instalar nada, funciona desde el navegador.' },
            { q: '¿Necesito ser presidente para registrarme?', a: 'No. Cualquier propietario puede registrar su comunidad. Eso sí, el que se registra primero tiene el rol de administrador.' },
            { q: '¿Puede mi administrador de fincas gestionar la cuenta?', a: 'Sí. Puedes invitar a tu administrador de fincas como gestor. Tendrá acceso completo sin coste adicional.' },
          ].map(({ q, a }) => (
            <div key={q} className="bg-white/3 border border-white/8 rounded-xl p-5">
              <h3 className="font-bold text-white mb-2 text-sm">{q}</h3>
              <p className="text-slate-400 text-sm">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-black mb-4">¿A qué esperas?</h2>
        <p className="text-slate-400 mb-8">Únete a miles de comunidades que ya gestionan todo digitalmente. Empieza hoy, gratis.</p>
        <Link href="/register" className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold px-10 py-4 rounded-xl text-lg transition">
          Empezar gratis 30 días →
        </Link>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-slate-600 text-sm">
        <Link href="/privacy" className="hover:text-white mr-4 transition">Privacidad</Link>
        <Link href="/terms" className="hover:text-white mr-4 transition">Términos</Link>
        <Link href="/blog" className="hover:text-white mr-4 transition">Blog</Link>
        <Link href="/calculadora" className="hover:text-white transition">Calculadora</Link>
        <p className="mt-2">© 2026 FincaHub S.L.</p>
      </footer>
    </div>
  );
}
