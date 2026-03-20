import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — Guías y consejos para presidentes de comunidad',
  description:
    'Guías prácticas, plantillas y consejos para presidentes y administradores de comunidades de vecinos en España. Todo lo que necesitas saber sobre la Ley de Propiedad Horizontal.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog FincaHub — Guías para comunidades de vecinos',
    description:
      'Artículos prácticos para presidentes y administradores de fincas. Contabilidad, morosos, votaciones, reformas y mucho más.',
    url: 'https://fincahub.com/blog',
  },
};

const ARTICLES = [
  {
    slug: 'convocar-junta-propietarios',
    title: 'Cómo convocar una junta de propietarios paso a paso',
    excerpt:
      'Plazos legales, modelo de convocatoria, quórum necesario y errores que pueden anular todos los acuerdos. Guía completa según la LPH.',
    category: 'Legal',
    readTime: '9 min',
    date: '18 Mar 2026',
    color: 'from-green-500/20 to-green-500/5',
    border: 'border-green-500/30',
    tag: 'text-green-400 bg-green-500/10',
  },
  {
    slug: 'cuentas-comunidad-vecinos',
    title: 'Cómo hacer las cuentas de una comunidad de vecinos paso a paso',
    excerpt:
      'Guía completa para llevar la contabilidad de tu comunidad sin ser experto: ingresos, gastos, liquidaciones anuales y herramientas gratuitas.',
    category: 'Contabilidad',
    readTime: '8 min',
    date: '15 Mar 2026',
    color: 'from-blue-500/20 to-blue-500/5',
    border: 'border-blue-500/30',
    tag: 'text-blue-400 bg-blue-500/10',
  },
  {
    slug: 'presupuesto-anual-comunidad-vecinos',
    title: 'Presupuesto anual de comunidad de vecinos: cómo hacerlo bien',
    excerpt:
      'Partidas obligatorias, fondo de reserva del 10%, cómo calcular la cuota mensual de cada vecino y cómo aprobarlo correctamente en junta.',
    category: 'Contabilidad',
    readTime: '7 min',
    date: '15 Mar 2026',
    color: 'from-sky-500/20 to-sky-500/5',
    border: 'border-sky-500/30',
    tag: 'text-sky-400 bg-sky-500/10',
  },
  {
    slug: 'derramas-comunidad-propietarios',
    title: 'Derramas en comunidades: cómo calcularlas y cobrarlas',
    excerpt:
      'Todo sobre derramas ordinarias y extraordinarias: cuándo son legales, cómo se calculan por coeficiente y qué pasa si un vecino se niega a pagar.',
    category: 'Contabilidad',
    readTime: '8 min',
    date: '17 Mar 2026',
    color: 'from-yellow-500/20 to-yellow-500/5',
    border: 'border-yellow-500/30',
    tag: 'text-yellow-400 bg-yellow-500/10',
  },
  {
    slug: 'cobrar-morosos-comunidad',
    title: 'Cómo cobrar deudas a vecinos morosos sin ir al juzgado',
    excerpt:
      'El proceso legal para reclamar deudas en una comunidad de propietarios: desde la carta de reclamación hasta el procedimiento monitorio. Con plantillas descargables.',
    category: 'Legal',
    readTime: '10 min',
    date: '10 Mar 2026',
    color: 'from-red-500/20 to-red-500/5',
    border: 'border-red-500/30',
    tag: 'text-red-400 bg-red-500/10',
  },
  {
    slug: 'ruidos-vecinos-comunidad',
    title: 'Ruidos de vecinos: qué hacer y cómo reclamar legalmente',
    excerpt:
      'Límites legales de ruido, pasos desde hablar con el vecino hasta la vía judicial y cómo documentar el problema para que tenga validez legal.',
    category: 'Convivencia',
    readTime: '6 min',
    date: '14 Mar 2026',
    color: 'from-purple-500/20 to-purple-500/5',
    border: 'border-purple-500/30',
    tag: 'text-purple-400 bg-purple-500/10',
  },
  {
    slug: 'votaciones-online-comunidad',
    title: 'Votaciones online en comunidades de vecinos: ¿son legales en España?',
    excerpt:
      'Todo sobre las votaciones telemáticas en juntas de propietarios tras la reforma de la LPH. Qué dice la ley, cómo hacerlo bien y qué herramientas usar.',
    category: 'Legal',
    readTime: '7 min',
    date: '5 Mar 2026',
    color: 'from-indigo-500/20 to-indigo-500/5',
    border: 'border-indigo-500/30',
    tag: 'text-indigo-400 bg-indigo-500/10',
  },
  {
    slug: 'estatutos-comunidad-propietarios',
    title: 'Estatutos de comunidad de propietarios: qué son y cómo cambiarlos',
    excerpt:
      'Diferencias entre estatutos y reglamento interior, qué pueden regular, por qué se necesita unanimidad para modificarlos y cómo hacerlo.',
    category: 'Legal',
    readTime: '8 min',
    date: '12 Mar 2026',
    color: 'from-teal-500/20 to-teal-500/5',
    border: 'border-teal-500/30',
    tag: 'text-teal-400 bg-teal-500/10',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          FincaHub
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/comparativa" className="text-slate-400 hover:text-white text-sm transition">Comparativa</Link>
          <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition">
            Empezar gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <div className="inline-block bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
          El Blog del Presidente
        </div>
        <h1 className="text-4xl font-black mb-4">
          Guías para comunidades de vecinos
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Todo lo que necesitas saber para gestionar tu comunidad sin dramas. Contabilidad, morosos, votaciones y mucho más.
        </p>
      </section>

      {/* Artículos */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES.map((a) => (
            <Link key={a.slug} href={`/blog/${a.slug}`} className={`group bg-gradient-to-b ${a.color} border ${a.border} rounded-2xl p-6 hover:scale-[1.02] transition-transform`}>
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${a.tag}`}>{a.category}</span>
                <span className="text-slate-500 text-xs">{a.readTime} lectura</span>
              </div>
              <h2 className="text-base font-bold text-white leading-snug mb-3 group-hover:text-blue-300 transition">
                {a.title}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{a.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-xs">{a.date}</span>
                <span className="text-blue-400 text-sm font-semibold">Leer →</span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/8 rounded-2xl p-10">
          <h3 className="text-2xl font-black mb-3">¿Quieres gestionar tu comunidad sin papeles?</h3>
          <p className="text-slate-400 mb-6">Prueba FincaHub gratis durante 30 días. Sin tarjeta. Sin permanencia.</p>
          <Link href="/register" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-3 rounded-xl transition">
            Empezar gratis →
          </Link>
        </div>
      </section>
    </div>
  );
}
