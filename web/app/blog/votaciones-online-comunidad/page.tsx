import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Votaciones online en comunidades de vecinos: ¿son legales en España? (2026)',
  description:
    'Todo sobre las votaciones telemáticas en juntas de propietarios tras la reforma de la LPH. Requisitos legales, cómo organizarlas y qué herramientas usar.',
  alternates: { canonical: '/blog/votaciones-online-comunidad' },
  openGraph: {
    title: 'Votaciones online en comunidades de vecinos: ¿son legales en España?',
    description:
      'Guía legal completa sobre las votaciones telemáticas en juntas de propietarios.',
    url: 'https://fincahub.com/blog/votaciones-online-comunidad',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Votaciones online en comunidades de vecinos: ¿son legales en España? (2026)',
  author: { '@type': 'Organization', name: 'FincaHub' },
  publisher: { '@type': 'Organization', name: 'FincaHub', url: 'https://fincahub.com' },
  datePublished: '2026-03-05',
  dateModified: '2026-03-05',
  mainEntityOfPage: 'https://fincahub.com/blog/votaciones-online-comunidad',
  inLanguage: 'es',
};

export default function ArticleVotaciones() {
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
          <span className="text-xs font-bold px-3 py-1 rounded-full text-purple-400 bg-purple-500/10 border border-purple-500/20">Legal</span>
          <span className="text-slate-500 text-xs ml-3">5 Mar 2026 · 7 min lectura</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black leading-tight mb-6">
          Votaciones online en comunidades de vecinos: ¿son legales en España? (2026)
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10 border-l-4 border-purple-500/50 pl-5">
          Desde la reforma de la Ley de Propiedad Horizontal, las comunidades pueden celebrar juntas y votaciones por medios telemáticos. Te explicamos exactamente cuándo es legal, cómo hacerlo bien y qué herramientas necesitas.
        </p>

        <div className="space-y-8 text-[15px] leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-4">¿Qué dice la ley exactamente?</h2>
            <p className="text-slate-300">
              El <strong className="text-white">Real Decreto-Ley 8/2021</strong> modificó la LPH para permitir la celebración de juntas de propietarios por videoconferencia u otros medios telemáticos que garanticen la identificación de los asistentes, la comunicación bidireccional y la posibilidad de intervenir en las deliberaciones.
            </p>
            <div className="bg-purple-500/8 border border-purple-500/20 rounded-xl p-5 mt-4">
              <p className="text-purple-300 font-semibold text-sm mb-2">Condiciones legales para que la votación sea válida:</p>
              <ul className="text-slate-300 text-sm space-y-2">
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Los propietarios deben poder identificarse (email verificado o firma digital)</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> El resultado debe quedar registrado y ser trazable</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Debe respetarse el quórum necesario según el tipo de acuerdo</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> El acta debe reflejar que la votación fue telemática</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">¿Qué acuerdos pueden votarse online?</h2>
            <p className="text-slate-300">Prácticamente todos, con las mayorías correspondientes de la LPH:</p>
            <div className="mt-4 space-y-3">
              {[
                { tipo: 'Mayoría simple', ejemplos: 'Aprobación de presupuesto, normas de convivencia, gastos ordinarios', color: 'emerald' },
                { tipo: '3/5 de propietarios y cuotas', ejemplos: 'Servicios comunes, ascensor, supresión de barreras arquitectónicas', color: 'blue' },
                { tipo: 'Unanimidad', ejemplos: 'Modificación del título constitutivo, cambio de uso de elementos comunes', color: 'purple' },
              ].map((r) => (
                <div key={r.tipo} className={`border border-${r.color}-500/20 rounded-xl p-4`}>
                  <div className={`text-${r.color}-400 font-bold text-sm mb-1`}>{r.tipo}</div>
                  <div className="text-slate-400 text-sm">{r.ejemplos}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">La delegación de voto: clave para alcanzar quórum</h2>
            <p className="text-slate-300">
              Uno de los mayores problemas en las juntas —presenciales u online— es no alcanzar el quórum. La solución es la <strong className="text-white">delegación de voto</strong>: un propietario autoriza a otro a votar en su nombre.
            </p>
            <p className="text-slate-300 mt-3">
              Con FincaHub, la delegación se hace digitalmente: el vecino accede desde su móvil, selecciona a quién delega su voto y confirma con un clic. Todo queda registrado y auditable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Cómo organizar una votación online paso a paso</h2>
            <ol className="space-y-4">
              {[
                ['Convoca la junta', 'Envía la convocatoria con al menos 6 días de antelación, incluyendo el orden del día y el enlace para conectarse.'],
                ['Verifica que todos tienen acceso', 'Comprueba que todos los propietarios tienen email registrado y pueden acceder a la plataforma.'],
                ['Abre la votación', 'En FincaHub, crea la votación con las opciones y la duración. Los vecinos reciben notificación automática.'],
                ['Cierra y certifica', 'Al cerrar la votación, el sistema genera el acta automáticamente con el resultado desglosado.'],
              ].map(([titulo, desc], i) => (
                <li key={titulo} className="flex gap-4 items-start">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black text-xs flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm mb-1">{titulo}</div>
                    <div className="text-slate-400 text-sm">{desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">¿Puede un propietario impugnar el resultado?</h2>
            <p className="text-slate-300">
              Sí, dentro de los <strong className="text-white">3 meses siguientes a la adopción del acuerdo</strong> (1 año si el acuerdo es contrario a la ley o a los estatutos). Por eso es tan importante que el sistema genere un registro trazable de quién votó qué y cuándo.
            </p>
          </section>

          <section className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-white/10 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-black mb-3">¿Lista para tu primera votación online?</h3>
            <p className="text-slate-400 mb-6">
              FincaHub es el único software para comunidades con votaciones online legales, delegación de voto y acta automática certificada.
            </p>
            <Link href="/register" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-3 rounded-xl transition">
              Probar gratis 30 días →
            </Link>
          </section>
        </div>
      </article>
    </div>
  );
}
