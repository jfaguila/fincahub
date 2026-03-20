import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Derramas en comunidades de propietarios: cómo calcularlas y cobrarlas (2026)',
  description:
    'Todo sobre las derramas ordinarias y extraordinarias: cuándo son legales, cómo se calculan por coeficiente y cómo cobrarlas a los vecinos.',
  alternates: { canonical: '/blog/derramas-comunidad-propietarios' },
  openGraph: {
    title: 'Derramas en comunidades: cómo calcularlas y cobrarlas (2026)',
    description:
      'Guía completa sobre derramas ordinarias y extraordinarias en comunidades de vecinos.',
    url: 'https://fincahub.com/blog/derramas-comunidad-propietarios',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Derramas en comunidades de propietarios: cómo calcularlas y cobrarlas (2026)',
  description: 'Guía completa sobre derramas en comunidades de vecinos.',
  author: { '@type': 'Organization', name: 'FincaHub' },
  publisher: { '@type': 'Organization', name: 'FincaHub', url: 'https://fincahub.com' },
  datePublished: '2026-03-17',
  dateModified: '2026-03-17',
  mainEntityOfPage: 'https://fincahub.com/blog/derramas-comunidad-propietarios',
  inLanguage: 'es',
};

export default function ArticleDerramas() {
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
          <span className="text-xs font-bold px-3 py-1 rounded-full text-yellow-400 bg-yellow-500/10 border border-yellow-500/20">Contabilidad</span>
          <span className="text-slate-500 text-xs ml-3">17 Mar 2026 · 8 min lectura</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black leading-tight mb-6">
          Derramas en comunidades de propietarios: cómo calcularlas y cobrarlas (2026)
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10 border-l-4 border-yellow-500/50 pl-5">
          La fachada necesita reforma, el ascensor se ha averiado, la piscina necesita obra... ¿Cómo repartir el coste entre los vecinos? Todo lo que necesitas saber sobre derramas.
        </p>

        <div className="space-y-10 text-[15px] leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-4">¿Qué es una derrama?</h2>
            <p className="text-slate-300">
              Una <strong className="text-white">derrama</strong> es un cobro extraordinario que la comunidad de propietarios hace a sus miembros para financiar un gasto no previsto en el presupuesto ordinario (o que lo supera). Puede pagarse de una vez o en cuotas mensuales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Tipos de derrama</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5">
                <h3 className="font-bold text-yellow-400 mb-2">Derrama Ordinaria</h3>
                <p className="text-slate-300 text-sm">Cuando el gasto supera el fondo de reserva pero no es urgente. Requiere acuerdo en junta por mayoría simple. Ejemplo: pintar el portal, renovar buzones.</p>
              </div>
              <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-5">
                <h3 className="font-bold text-orange-400 mb-2">Derrama Extraordinaria</h3>
                <p className="text-slate-300 text-sm">Para gastos urgentes o de gran importe. Puede requerir mayoría cualificada. Ejemplo: reparación urgente del ascensor, obras en cubierta.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">¿Cuándo es legal exigir una derrama?</h2>
            <p className="text-slate-300 mb-4">Según la <strong className="text-white">LPH (art. 9.1.e)</strong>, los propietarios están obligados a contribuir a los gastos generales según su cuota de participación. Una derrama es legal cuando:</p>
            <ul className="space-y-2 text-slate-300">
              {[
                'Ha sido aprobada en junta de propietarios con la mayoría necesaria',
                'El gasto es para conservación, mantenimiento o mejora del edificio',
                'Se reparte según los coeficientes de participación de los estatutos',
                'Se notifica correctamente a todos los propietarios',
              ].map((item) => (
                <li key={item} className="flex gap-3 items-start">
                  <span className="text-yellow-400 mt-0.5 shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Cómo calcular la derrama por propietario</h2>
            <p className="text-slate-300 mb-4">El reparto se hace según el <strong className="text-white">coeficiente de participación</strong> de cada vivienda (fijado en la escritura de división horizontal).</p>
            <div className="bg-slate-900 border border-yellow-500/20 rounded-xl p-6">
              <p className="text-yellow-400 font-mono font-bold mb-3">Fórmula:</p>
              <p className="text-white font-mono text-lg mb-4">Cuota propietario = (Coste total × Coeficiente %) / 100</p>
              <div className="border-t border-white/10 pt-4">
                <p className="text-slate-400 text-sm font-semibold mb-2">Ejemplo práctico:</p>
                <p className="text-slate-300 text-sm">Obra de fachada: <strong className="text-white">€18.000</strong></p>
                <p className="text-slate-300 text-sm">Piso 1A con coeficiente <strong className="text-white">8,5%</strong></p>
                <p className="text-slate-300 text-sm mt-2">Cuota = 18.000 × 8,5 / 100 = <strong className="text-yellow-400">€1.530</strong></p>
              </div>
            </div>
            <p className="text-slate-500 text-sm mt-3">Con FincaHub puedes calcular y generar automáticamente la derrama para todos los vecinos desde la sección de contabilidad → Liquidación por coeficientes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">¿Puede un propietario negarse a pagar la derrama?</h2>
            <p className="text-slate-300 mb-3">
              <strong className="text-white">No.</strong> Si la derrama ha sido aprobada legalmente en junta, todos los propietarios están obligados a pagarla, incluso quienes votaron en contra.
            </p>
            <p className="text-slate-300">
              El impago convierte al propietario en moroso y la comunidad puede reclamarla judicialmente mediante el <strong className="text-white">proceso monitorio</strong> (ver nuestra guía sobre morosos).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">¿Qué pasa con la derrama si se vende el piso?</h2>
            <p className="text-slate-300">
              Si la derrama estaba <strong className="text-white">aprobada antes de la venta</strong>, el comprador no está obligado a pagar las cuotas pendientes del vendedor, salvo pacto expreso en contrato. Sin embargo, el comprador sí asume las cuotas futuras desde la transmisión. Es fundamental pedir el <em className="text-white">certificado de deudas</em> antes de firmar.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {[
                { q: '¿Cuánto puede ser una derrama sin votación?', a: 'La LPH permite al presidente ordenar obras urgentes de hasta 3 meses de cuotas ordinarias sin junta previa. Para importes mayores siempre es necesario acuerdo en junta.' },
                { q: '¿La derrama es deducible en el IRPF?', a: 'Si el piso está en alquiler, sí. La derrama para reparaciones es un gasto deducible del rendimiento del capital inmobiliario.' },
                { q: '¿Puede la comunidad pedir un préstamo en lugar de una derrama?', a: 'Sí. La junta puede acordar solicitar un crédito a una entidad bancaria y devolver las cuotas con un incremento de la cuota mensual. Requiere acuerdo de 3/5 partes.' },
              ].map(({ q, a }) => (
                <div key={q} className="bg-white/3 border border-white/8 rounded-xl p-5">
                  <h3 className="font-bold text-white mb-2">{q}</h3>
                  <p className="text-slate-400 text-sm">{a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-14 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-white/10 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-black mb-2">Calcula tu derrama en segundos</h3>
          <p className="text-slate-400 text-sm mb-5">FincaHub reparte automáticamente cualquier gasto entre los vecinos según su coeficiente. Sin Excel, sin errores.</p>
          <Link href="/register" className="inline-block bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold px-8 py-3 rounded-xl transition">
            Empezar gratis 30 días →
          </Link>
        </div>
      </article>
    </div>
  );
}
