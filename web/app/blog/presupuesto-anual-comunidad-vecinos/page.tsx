import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Presupuesto anual de una comunidad de vecinos: cómo hacerlo bien (2026)',
  description:
    'Guía práctica para elaborar el presupuesto anual de tu comunidad de propietarios: partidas obligatorias, fondo de reserva y cómo aprobarlo en junta.',
  alternates: { canonical: '/blog/presupuesto-anual-comunidad-vecinos' },
  openGraph: {
    title: 'Presupuesto anual comunidad de vecinos: guía completa 2026',
    description:
      'Elabora el presupuesto de tu comunidad correctamente: partidas, fondo de reserva y aprobación en junta.',
    url: 'https://fincahub.com/blog/presupuesto-anual-comunidad-vecinos',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Presupuesto anual de una comunidad de vecinos: cómo hacerlo bien (2026)',
  description: 'Guía práctica para elaborar el presupuesto anual de una comunidad de propietarios.',
  author: { '@type': 'Organization', name: 'FincaHub' },
  publisher: { '@type': 'Organization', name: 'FincaHub', url: 'https://fincahub.com' },
  datePublished: '2026-03-15',
  dateModified: '2026-03-15',
  mainEntityOfPage: 'https://fincahub.com/blog/presupuesto-anual-comunidad-vecinos',
  inLanguage: 'es',
};

const PARTIDAS = [
  { name: 'Limpieza (portal, escaleras)', typical: '€1.200–€3.600/año', notes: 'Depende de frecuencia y tamaño' },
  { name: 'Mantenimiento ascensor', typical: '€800–€2.000/año', notes: 'Contrato de mantenimiento obligatorio' },
  { name: 'Electricidad zonas comunes', typical: '€600–€2.400/año', notes: 'Luz escalera, garaje, jardín' },
  { name: 'Seguro del edificio', typical: '€400–€1.200/año', notes: 'Obligatorio por ley' },
  { name: 'Jardín y piscina', typical: '€1.000–€5.000/año', notes: 'Solo si hay zonas ajardinadas' },
  { name: 'Administrador de fincas', typical: '€600–€1.800/año', notes: 'Si se externaliza la gestión' },
  { name: 'Fondo de reserva (mínimo 10%)', typical: '10% del total', notes: 'Obligatorio por la LPH' },
  { name: 'Imprevistos', typical: '5–10% del total', notes: 'Recomendado para evitar derramas' },
];

export default function ArticlePresupuesto() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">FincaHub</Link>
        <div className="flex items-center gap-4">
          <Link href="/blog" className="text-slate-400 hover:text-white text-sm transition">← Blog</Link>
          <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition">Empezar gratis</Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-14">
        <div className="mb-8">
          <span className="text-xs font-bold px-3 py-1 rounded-full text-blue-400 bg-blue-500/10 border border-blue-500/20">Contabilidad</span>
          <span className="text-slate-500 text-xs ml-3">15 Mar 2026 · 7 min lectura</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black leading-tight mb-6">
          Presupuesto anual de una comunidad de vecinos: cómo hacerlo bien (2026)
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10 border-l-4 border-blue-500/50 pl-5">
          El presupuesto anual es la hoja de ruta económica de tu comunidad. Aprobarlo bien evita derramas sorpresa, conflictos entre vecinos y problemas legales.
        </p>

        <div className="space-y-10 text-[15px] leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-4">¿Por qué es obligatorio el presupuesto anual?</h2>
            <p className="text-slate-300">
              La <strong className="text-white">LPH (art. 16.1)</strong> establece que la junta ordinaria debe celebrarse al menos una vez al año para, entre otros asuntos, <strong className="text-white">aprobar el plan de gastos e ingresos previsibles</strong>. Sin presupuesto aprobado, la comunidad no puede reclamar judicialmente las cuotas impagadas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">El fondo de reserva: obligatorio mínimo 10%</h2>
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
              <p className="text-slate-300 text-sm">
                La LPH obliga a mantener un <strong className="text-white">fondo de reserva mínimo del 10%</strong> del presupuesto ordinario anual. Este fondo está pensado para hacer frente a obras urgentes sin necesidad de derrama.
              </p>
              <p className="text-slate-300 text-sm mt-3">
                <strong className="text-blue-400">Importante:</strong> el fondo de reserva no puede usarse para gastos corrientes (limpieza, luz...). Solo para obras y reparaciones extraordinarias.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Partidas habituales del presupuesto</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Partida</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Importe típico</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Notas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {PARTIDAS.map((p) => (
                    <tr key={p.name} className="hover:bg-white/2">
                      <td className="py-3 px-4 text-slate-300">{p.name}</td>
                      <td className="py-3 px-4 text-blue-400 font-medium">{p.typical}</td>
                      <td className="py-3 px-4 text-slate-500 text-xs">{p.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Cómo calcular la cuota mensual de cada vecino</h2>
            <p className="text-slate-300 mb-4">Una vez tienes el presupuesto total, divides por los coeficientes de participación de cada vivienda:</p>
            <div className="bg-slate-900 border border-blue-500/20 rounded-xl p-6">
              <p className="text-blue-400 font-mono font-bold mb-3">Ejemplo:</p>
              <p className="text-slate-300 text-sm">Presupuesto total anual: <strong className="text-white">€24.000</strong></p>
              <p className="text-slate-300 text-sm">Piso con coeficiente <strong className="text-white">7,5%</strong></p>
              <p className="text-slate-300 text-sm mt-2">Cuota anual = 24.000 × 7,5 / 100 = <strong className="text-blue-400">€1.800</strong></p>
              <p className="text-slate-300 text-sm">Cuota mensual = 1.800 / 12 = <strong className="text-blue-400">€150/mes</strong></p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Pasos para aprobarlo en junta</h2>
            <div className="space-y-3">
              {[
                { n: '1', t: 'Prepara el borrador', d: 'Con los gastos del año anterior + incrementos previstos (IPC, nuevos contratos...)' },
                { n: '2', t: 'Inclúyelo en el orden del día', d: 'La aprobación del presupuesto debe estar expresamente en la convocatoria de junta ordinaria' },
                { n: '3', t: 'Presenta en junta', d: 'Explica cada partida con sus justificaciones. Transparencia = menos conflictos' },
                { n: '4', t: 'Votación', d: 'Se aprueba por mayoría simple de propietarios presentes (50% + 1)' },
                { n: '5', t: 'Recoge en el acta', d: 'El presupuesto aprobado debe quedar reflejado en el acta de la junta' },
              ].map((s) => (
                <div key={s.n} className="flex gap-4 items-start bg-white/3 border border-white/8 rounded-xl p-4">
                  <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold flex items-center justify-center shrink-0">{s.n}</span>
                  <div>
                    <p className="font-semibold text-white text-sm">{s.t}</p>
                    <p className="text-slate-400 text-sm">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {[
                { q: '¿Qué pasa si no se aprueba el presupuesto?', a: 'La comunidad queda sin presupuesto vigente. Se puede seguir cobrando la misma cuota del año anterior provisionalmente, pero no se puede reclamar judicialmente hasta que haya uno aprobado.' },
                { q: '¿Puede un vecino impugnar el presupuesto aprobado?', a: 'Sí, tiene 3 meses desde la aprobación para impugnarlo judicialmente si cree que hay irregularidades. Por eso es clave documentarlo bien.' },
                { q: '¿Cómo sé si mi presupuesto es realista?', a: 'Compara con los gastos reales del año anterior. FincaHub te muestra la diferencia presupuestado vs. real en cada categoría en tiempo real.' },
              ].map(({ q, a }) => (
                <div key={q} className="bg-white/3 border border-white/8 rounded-xl p-5">
                  <h3 className="font-bold text-white mb-2">{q}</h3>
                  <p className="text-slate-400 text-sm">{a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-14 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-black mb-2">Gestiona el presupuesto de tu comunidad online</h3>
          <p className="text-slate-400 text-sm mb-5">Crea el presupuesto, haz el seguimiento en tiempo real y detecta desviaciones antes de que sean un problema.</p>
          <Link href="/register" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-3 rounded-xl transition">
            Empezar gratis 30 días →
          </Link>
        </div>
      </article>
    </div>
  );
}
