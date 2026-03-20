import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Software para Administradores de Fincas — FincaHub',
  description:
    'El software que los administradores de fincas modernos usan para digitalizar su cartera. Gestiona múltiples comunidades desde un solo panel. 30 días gratis.',
  alternates: { canonical: '/software-administrador-fincas' },
  openGraph: {
    title: 'Software para Administradores de Fincas — FincaHub',
    description:
      'Digitaliza tu cartera de comunidades con FincaHub. Contabilidad, remesas SEPA, votaciones, juntas y portal del vecino. Prueba gratis.',
    url: 'https://fincahub.com/software-administrador-fincas',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'FincaHub — Software para Administradores de Fincas',
  applicationCategory: 'BusinessApplication',
  description: 'Plataforma profesional para administradores de fincas que gestionan múltiples comunidades de propietarios.',
  url: 'https://fincahub.com/software-administrador-fincas',
  offers: { '@type': 'Offer', price: '14.99', priceCurrency: 'EUR' },
};

const FEATURES = [
  {
    icon: '🏢',
    title: 'Multi-comunidad desde un panel',
    desc: 'Gestiona todas tus comunidades desde un único acceso. Cambia de comunidad en un clic sin cerrar sesión.',
  },
  {
    icon: '📊',
    title: 'Contabilidad automática',
    desc: 'Ingresos, gastos, balances y liquidaciones calculados automáticamente. Genera informes trimestrales con un clic.',
  },
  {
    icon: '🏦',
    title: 'Remesas SEPA ISO 20022',
    desc: 'Genera el fichero XML de remesa listo para subir a cualquier banco español. Cobro automático de cuotas.',
  },
  {
    icon: '📧',
    title: 'Comunicación masiva',
    desc: 'Envía convocatorias de junta, anuncios y reclamaciones por email a todos los vecinos con un clic.',
  },
  {
    icon: '⚖️',
    title: 'Gestión de morosos',
    desc: 'Detecta automáticamente impagos y genera cartas de reclamación formal. Historial completo de deuda.',
  },
  {
    icon: '📁',
    title: 'Repositorio documental',
    desc: 'Actas, estatutos, contratos y facturas centralizados en la nube. Acceso desde cualquier dispositivo.',
  },
];

const COMPARISON = [
  { feature: 'Precio base mensual', fincahub: '€14,99', otros: '€25–€80' },
  { feature: 'Multi-comunidad', fincahub: '✓ Todas los planes', otros: 'Solo premium' },
  { feature: 'Remesas SEPA', fincahub: '✓', otros: 'Depende del plan' },
  { feature: 'Votaciones online', fincahub: '✓', otros: '✗ No disponible' },
  { feature: 'Portal del vecino', fincahub: '✓ Incluido', otros: 'Módulo adicional' },
  { feature: 'Sin permanencia', fincahub: '✓', otros: 'Contrato anual' },
  { feature: 'Soporte en español', fincahub: '✓ Email + Chat', otros: 'Solo ticket' },
];

export default function SoftwareAdministradorFincas() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">FincaHub</Link>
        <div className="flex items-center gap-4">
          <Link href="/comparativa" className="text-slate-400 hover:text-white text-sm transition">Comparativa</Link>
          <Link href="/blog" className="text-slate-400 hover:text-white text-sm transition">Blog</Link>
          <Link href="/login" className="text-slate-400 hover:text-white text-sm transition">Acceder</Link>
          <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition">Empezar gratis</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
          Para administradores de fincas profesionales
        </div>
        <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6">
          El software que tus comunidades<br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">merecen en 2026</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
          Deja atrás el software heredado de los 90. FincaHub digitaliza tu cartera de comunidades con contabilidad automática, remesas SEPA, votaciones online y portal del vecino. Todo en una sola herramienta.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition shadow-xl shadow-blue-500/20">
            Empezar gratis 30 días →
          </Link>
          <Link href="/comparativa" className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition">
            Ver comparativa
          </Link>
        </div>
        <p className="text-slate-600 text-sm mt-4">Sin tarjeta · Sin permanencia · Soporte en español</p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-black text-center mb-12">Herramientas para profesionales exigentes</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparación de precio */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-black text-center mb-3">Más potente. Más barato.</h2>
        <p className="text-slate-400 text-center mb-10">Comparado con el software tradicional de administración de fincas</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-5 text-slate-400 font-semibold">Característica</th>
                <th className="text-center py-4 px-5 text-blue-400 font-bold">FincaHub</th>
                <th className="text-center py-4 px-5 text-slate-500 font-semibold">Otros</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {COMPARISON.map((row) => (
                <tr key={row.feature} className="hover:bg-white/2">
                  <td className="py-4 px-5 text-slate-300">{row.feature}</td>
                  <td className="py-4 px-5 text-center text-green-400 font-semibold">{row.fincahub}</td>
                  <td className="py-4 px-5 text-center text-slate-500">{row.otros}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Testimonial */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-8 text-center">
          <div className="text-yellow-400 text-xl mb-4">★★★★★</div>
          <p className="text-slate-300 text-lg italic mb-6">
            "Gestiono 12 comunidades desde un solo panel. Las votaciones online han eliminado el 90% de las reuniones presenciales y mis clientes están mucho más satisfechos con la transparencia."
          </p>
          <div className="font-bold text-white">Ana García</div>
          <div className="text-slate-500 text-sm">Administradora de fincas colegiada, Barcelona</div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-black mb-4">Digitaliza tu despacho hoy</h2>
        <p className="text-slate-400 mb-8">30 días gratis. Sin tarjeta. Importa tus datos desde Excel en 5 minutos.</p>
        <Link href="/register" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-10 py-4 rounded-xl text-lg transition shadow-xl shadow-blue-500/20">
          Empezar gratis →
        </Link>
        <p className="text-slate-600 text-sm mt-4">
          ¿Tienes más de 50 comunidades? <a href="mailto:hola@fincahub.com" className="text-blue-400 hover:underline">Contáctanos para un plan personalizado</a>
        </p>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-slate-600 text-sm">
        <Link href="/privacy" className="hover:text-white mr-4 transition">Privacidad</Link>
        <Link href="/terms" className="hover:text-white mr-4 transition">Términos</Link>
        <Link href="/comparativa" className="hover:text-white mr-4 transition">Comparativa</Link>
        <Link href="/blog" className="hover:text-white transition">Blog</Link>
        <p className="mt-2">© 2026 FincaHub S.L. · <a href="mailto:hola@fincahub.com" className="hover:text-white transition">hola@fincahub.com</a></p>
      </footer>
    </div>
  );
}
