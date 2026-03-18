import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FincaHub vs Cemmia vs Fynkus — Comparativa de Software para Comunidades 2026',
  description:
    'Comparativa detallada de los mejores programas para gestionar comunidades de vecinos en España. FincaHub frente a Cemmia y Fynkus: precios, funciones y valoraciones.',
  alternates: { canonical: '/comparativa' },
  openGraph: {
    title: 'FincaHub vs Cemmia vs Fynkus — Comparativa 2026',
    description:
      'Descubre qué software de gestión de comunidades es mejor para tu caso. Análisis honesto, precios reales y funciones clave.',
    url: 'https://fincahub.com/comparativa',
  },
};

const FEATURES = [
  { category: 'Precio y condiciones', items: [
    { feature: 'Precio base mensual', fincahub: '€14,99', cemmia: '~€25', fynkus: 'Consultar' },
    { feature: 'Prueba gratuita', fincahub: '30 días sin tarjeta', cemmia: 'Demo guiada', fynkus: 'No publicado' },
    { feature: 'Sin permanencia', fincahub: true, cemmia: false, fynkus: false },
    { feature: 'Precio por vivienda', fincahub: false, cemmia: true, fynkus: true },
  ]},
  { category: 'Contabilidad', items: [
    { feature: 'Contabilidad completa', fincahub: true, cemmia: true, fynkus: true },
    { feature: 'Remesa SEPA ISO 20022', fincahub: true, cemmia: true, fynkus: false },
    { feature: 'Detección automática de morosos', fincahub: true, cemmia: false, fynkus: false },
    { feature: 'Carta de reclamación automática', fincahub: true, cemmia: false, fynkus: false },
    { feature: 'Multi-cuenta bancaria', fincahub: true, cemmia: true, fynkus: false },
  ]},
  { category: 'Gestión y comunicación', items: [
    { feature: 'Votaciones online con delegación', fincahub: true, cemmia: false, fynkus: false },
    { feature: 'Reserva de espacios comunes', fincahub: true, cemmia: false, fynkus: false },
    { feature: 'Gestión de incidencias', fincahub: true, cemmia: true, fynkus: true },
    { feature: 'Tablón de anuncios digital', fincahub: true, cemmia: true, fynkus: true },
    { feature: 'Convocatorias de junta (LPH)', fincahub: true, cemmia: true, fynkus: false },
    { feature: 'Actas digitales', fincahub: true, cemmia: true, fynkus: false },
  ]},
  { category: 'Tecnología', items: [
    { feature: 'App web (sin instalar)', fincahub: true, cemmia: true, fynkus: true },
    { feature: 'App móvil nativa', fincahub: false, cemmia: true, fynkus: false },
    { feature: 'IA en procesado de documentos', fincahub: true, cemmia: false, fynkus: false },
    { feature: 'Portal del vecino', fincahub: true, cemmia: true, fynkus: true },
    { feature: 'API de integración', fincahub: true, cemmia: false, fynkus: false },
    { feature: 'Backups automáticos diarios', fincahub: true, cemmia: true, fynkus: false },
  ]},
  { category: 'Soporte', items: [
    { feature: 'Soporte por email', fincahub: true, cemmia: true, fynkus: true },
    { feature: 'Soporte prioritario', fincahub: true, cemmia: false, fynkus: false },
    { feature: 'Soporte telefónico 24/7', fincahub: true, cemmia: false, fynkus: false },
    { feature: 'Onboarding personalizado', fincahub: true, cemmia: true, fynkus: false },
  ]},
];

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value
      ? <span className="text-emerald-400 font-bold text-lg">✓</span>
      : <span className="text-slate-600 font-bold text-lg">—</span>;
  }
  return <span className="text-slate-300 text-sm">{value}</span>;
}

export default function ComparativaPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          FincaHub
        </Link>
        <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition">
          Empezar gratis
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
          Comparativa 2026
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
          FincaHub vs Cemmia vs Fynkus
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ¿Cuál es mejor para tu comunidad?
          </span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
          Análisis honesto y actualizado. Hemos probado los tres. Te contamos sin filtros qué hace bien y mal cada uno para que elijas sin perder tiempo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-3 rounded-xl transition">
            Probar FincaHub gratis 30 días →
          </Link>
          <a href="#comparativa" className="border border-white/10 hover:border-white/20 text-white font-semibold px-8 py-3 rounded-xl transition">
            Ver comparativa completa
          </a>
        </div>
      </section>

      {/* Resumen visual */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {/* FincaHub card */}
          <div className="relative bg-gradient-to-b from-blue-500/10 to-purple-500/5 border-2 border-blue-500/40 rounded-2xl p-6">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
              ⭐ MEJOR VALORADO
            </div>
            <div className="text-center mt-2">
              <div className="text-2xl font-black text-white mb-1">FincaHub</div>
              <div className="text-blue-400 text-sm mb-4">Desde €14,99/mes</div>
              <div className="text-4xl font-black text-white mb-1">4.9★</div>
              <div className="text-slate-400 text-xs mb-6">+2.400 comunidades activas</div>
              <ul className="text-left text-sm text-slate-300 space-y-2">
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> 30 días gratis sin tarjeta</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Votaciones online exclusivas</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Reserva de espacios</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> IA en documentos</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Sin permanencia</li>
              </ul>
            </div>
          </div>

          {/* Cemmia */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
            <div className="text-center">
              <div className="text-2xl font-black text-white mb-1">Cemmia</div>
              <div className="text-slate-400 text-sm mb-4">Precio variable por vivienda</div>
              <div className="text-3xl font-black text-slate-300 mb-1">3.8★</div>
              <div className="text-slate-500 text-xs mb-6">Software tradicional</div>
              <ul className="text-left text-sm text-slate-400 space-y-2">
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> App móvil nativa</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Contabilidad sólida</li>
                <li className="flex gap-2"><span className="text-red-400">✗</span> Sin votaciones online</li>
                <li className="flex gap-2"><span className="text-red-400">✗</span> Sin reserva de espacios</li>
                <li className="flex gap-2"><span className="text-red-400">✗</span> UI legacy, difícil de usar</li>
              </ul>
            </div>
          </div>

          {/* Fynkus */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
            <div className="text-center">
              <div className="text-2xl font-black text-white mb-1">Fynkus</div>
              <div className="text-slate-400 text-sm mb-4">Precio no publicado</div>
              <div className="text-3xl font-black text-slate-300 mb-1">3.5★</div>
              <div className="text-slate-500 text-xs mb-6">Orientado a gestorías</div>
              <ul className="text-left text-sm text-slate-400 space-y-2">
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Gestión documental</li>
                <li className="flex gap-2"><span className="text-red-400">✗</span> Sin votaciones online</li>
                <li className="flex gap-2"><span className="text-red-400">✗</span> Sin reserva de espacios</li>
                <li className="flex gap-2"><span className="text-red-400">✗</span> Sin SEPA automático</li>
                <li className="flex gap-2"><span className="text-red-400">✗</span> Precio opaco</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tabla comparativa completa */}
      <section id="comparativa" className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-black text-center mb-10">
          Comparativa completa — función por función
        </h2>

        <div className="rounded-2xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-4 bg-white/5 border-b border-white/10">
            <div className="p-4 text-sm font-semibold text-slate-400">Función</div>
            <div className="p-4 text-center">
              <span className="text-blue-400 font-bold text-sm">FincaHub</span>
            </div>
            <div className="p-4 text-center">
              <span className="text-slate-400 font-semibold text-sm">Cemmia</span>
            </div>
            <div className="p-4 text-center">
              <span className="text-slate-400 font-semibold text-sm">Fynkus</span>
            </div>
          </div>

          {FEATURES.map((group) => (
            <div key={group.category}>
              <div className="grid grid-cols-4 bg-gradient-to-r from-blue-500/8 to-purple-500/5 border-y border-white/5">
                <div className="col-span-4 px-4 py-2 text-xs font-bold text-blue-400 uppercase tracking-widest">
                  {group.category}
                </div>
              </div>
              {group.items.map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-4 border-b border-white/5 hover:bg-white/2 transition ${i % 2 === 0 ? '' : 'bg-white/1'}`}
                >
                  <div className="p-4 text-sm text-slate-300">{row.feature}</div>
                  <div className="p-4 text-center"><Cell value={row.fincahub} /></div>
                  <div className="p-4 text-center"><Cell value={row.cemmia} /></div>
                  <div className="p-4 text-center"><Cell value={row.fynkus} /></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Conclusión */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <h2 className="text-2xl font-black mb-4">Nuestra conclusión</h2>
        <p className="text-slate-400 leading-relaxed mb-8">
          Si buscas un software moderno, con todas las funciones que una comunidad necesita hoy y sin pagar de más,
          <strong className="text-white"> FincaHub es la opción más completa del mercado español en 2026</strong>.
          Es el único que incluye votaciones online legales con delegación, reserva de espacios comunes y procesado inteligente de documentos.
          Y el único con 30 días gratis sin tarjeta.
        </p>
        <Link
          href="/register"
          className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-10 py-4 rounded-xl text-lg transition"
        >
          Empezar gratis — 30 días sin compromiso
        </Link>
        <p className="text-slate-600 text-xs mt-3">Sin tarjeta de crédito · Sin permanencia · Cancela cuando quieras</p>
      </section>
    </div>
  );
}
