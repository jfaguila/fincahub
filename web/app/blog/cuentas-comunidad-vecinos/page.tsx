import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cómo hacer las cuentas de una comunidad de vecinos paso a paso (2026)',
  description:
    'Guía completa para llevar la contabilidad de una comunidad de propietarios: plan de cuentas, liquidación anual, cuotas y herramientas recomendadas.',
  alternates: { canonical: '/blog/cuentas-comunidad-vecinos' },
  openGraph: {
    title: 'Cómo hacer las cuentas de una comunidad de vecinos paso a paso',
    description:
      'Aprende a llevar la contabilidad de tu comunidad sin ser contable. Guía práctica con ejemplos reales.',
    url: 'https://fincahub.com/blog/cuentas-comunidad-vecinos',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cómo hacer las cuentas de una comunidad de vecinos paso a paso (2026)',
  description: 'Guía completa para llevar la contabilidad de una comunidad de propietarios.',
  author: { '@type': 'Organization', name: 'FincaHub' },
  publisher: { '@type': 'Organization', name: 'FincaHub', url: 'https://fincahub.com' },
  datePublished: '2026-03-15',
  dateModified: '2026-03-15',
  mainEntityOfPage: 'https://fincahub.com/blog/cuentas-comunidad-vecinos',
  inLanguage: 'es',
};

export default function ArticleCuentas() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Nav */}
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
          <span className="text-slate-500 text-xs ml-3">15 Mar 2026 · 8 min lectura</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black leading-tight mb-6">
          Cómo hacer las cuentas de una comunidad de vecinos paso a paso (2026)
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10 border-l-4 border-blue-500/50 pl-5">
          Llevar las cuentas de una comunidad de propietarios no requiere ser contable. Requiere orden, claridad y las herramientas adecuadas. En esta guía te explicamos todo el proceso desde cero.
        </p>

        <div className="prose prose-invert prose-slate max-w-none space-y-8 text-[15px] leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-4">¿Quién es responsable de las cuentas?</h2>
            <p className="text-slate-300">
              Según la <strong className="text-white">Ley de Propiedad Horizontal (LPH)</strong>, el presidente de la comunidad —o el administrador de fincas si lo hay— es el responsable de gestionar los fondos comunes y rendir cuentas a todos los propietarios en la junta anual.
            </p>
            <p className="text-slate-300 mt-3">
              Esto incluye: cobrar las cuotas, pagar los gastos, detectar morosos y presentar un balance claro que cualquier vecino pueda entender.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Paso 1 — Abre una cuenta bancaria exclusiva para la comunidad</h2>
            <p className="text-slate-300">
              El primer error que cometen muchas comunidades es mezclar los fondos comunes con cuentas personales. La comunidad debe tener su propia cuenta corriente a nombre de la comunidad de propietarios (no a nombre del presidente).
            </p>
            <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-5 mt-4">
              <p className="text-blue-300 text-sm font-semibold mb-2">Documentos necesarios para abrir la cuenta:</p>
              <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
                <li>CIF de la comunidad (se solicita en Hacienda, modelo 036)</li>
                <li>Acta de la junta que designa al presidente</li>
                <li>DNI del presidente</li>
                <li>Escrituras o statutos de la comunidad</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Paso 2 — Establece el presupuesto anual</h2>
            <p className="text-slate-300">
              Antes de empezar el año, la junta debe aprobar un presupuesto. Este documento estima todos los gastos previstos y determina cuánto debe pagar cada propietario.
            </p>
            <p className="text-slate-300 mt-3">Los gastos típicos incluyen:</p>
            <div className="grid md:grid-cols-2 gap-3 mt-4">
              {[
                ['Limpieza y portería', 'Mensual, el mayor gasto habitual'],
                ['Seguro del edificio', 'Obligatorio por ley'],
                ['Mantenimiento ascensor', 'Revisiones periódicas'],
                ['Agua zonas comunes', 'Jardines, limpieza'],
                ['Electricidad comunes', 'Portal, garaje, jardín'],
                ['Fondo de reserva', 'Mínimo 10% del presupuesto (LPH)'],
              ].map(([item, detail]) => (
                <div key={item} className="bg-white/3 border border-white/8 rounded-lg p-3">
                  <div className="text-white text-sm font-semibold">{item}</div>
                  <div className="text-slate-400 text-xs">{detail}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Paso 3 — Calcula las cuotas de cada propietario</h2>
            <p className="text-slate-300">
              Las cuotas se reparten según el <strong className="text-white">coeficiente de participación</strong> de cada vivienda, que aparece en las escrituras. Un piso con coeficiente del 2% paga el 2% de todos los gastos comunes.
            </p>
            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-5 mt-4 font-mono text-sm">
              <p className="text-slate-400 mb-2">Ejemplo:</p>
              <p className="text-white">Gasto total anual: <span className="text-blue-400">€12.000</span></p>
              <p className="text-white">Coeficiente del piso 3B: <span className="text-blue-400">2,5%</span></p>
              <p className="text-white mt-2 font-bold">Cuota anual 3B: <span className="text-emerald-400">€300</span> (€25/mes)</p>
            </div>
            <p className="text-slate-400 text-sm mt-3">
              ¿Quieres calcularlo automáticamente para todos los pisos? Usa nuestra{' '}
              <Link href="/calculadora" className="text-blue-400 hover:underline">calculadora de cuotas gratuita →</Link>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Paso 4 — Registra todos los movimientos</h2>
            <p className="text-slate-300">
              Cada euro que entra o sale debe quedar registrado con fecha, concepto e importe. Guarda siempre los justificantes (facturas, recibos, transferencias).
            </p>
            <p className="text-slate-300 mt-3">
              La forma más básica es una hoja de cálculo con dos columnas: <em>ingresos</em> y <em>gastos</em>. Pero si la comunidad tiene más de 15 viviendas, usar un software específico te ahorrará horas al mes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Paso 5 — Presenta la liquidación anual en junta</h2>
            <p className="text-slate-300">
              Una vez al año, en la junta ordinaria, el presidente debe presentar:
            </p>
            <ul className="text-slate-300 space-y-2 list-disc list-inside mt-3">
              <li>Liquidación del ejercicio anterior (ingresos vs gastos reales)</li>
              <li>Estado de deudas de morosos</li>
              <li>Saldo actual del fondo de reserva</li>
              <li>Presupuesto propuesto para el próximo año</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">El error más común: mezclar ingresos y gastos sin categorizar</h2>
            <p className="text-slate-300">
              Muchos presidentes anotan los gastos sin categorizar. Al final del año no saben cuánto se gastó en limpieza, cuánto en luz o cuánto fue a mantenimiento. Esto hace imposible comparar con años anteriores o detectar gastos desbocados.
            </p>
            <p className="text-slate-300 mt-3">
              Un buen sistema de contabilidad categoriza cada movimiento desde el primer momento. FincaHub lo hace automáticamente con IA.
            </p>
          </section>

          <section className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-black mb-3">¿Tienes que presentar las cuentas este año?</h3>
            <p className="text-slate-400 mb-6">FincaHub genera la liquidación anual automáticamente. Solo tienes que revisar y presentar.</p>
            <Link href="/register" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-3 rounded-xl transition">
              Probar gratis 30 días →
            </Link>
            <p className="text-slate-600 text-xs mt-3">Sin tarjeta · Sin permanencia</p>
          </section>
        </div>
      </article>
    </div>
  );
}
