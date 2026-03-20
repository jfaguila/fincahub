import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ruidos de vecinos en comunidad: qué hacer y cómo reclamar (2026)',
  description:
    'Guía legal para denunciar y solucionar problemas de ruido en una comunidad de propietarios. Desde hablar con el vecino hasta la vía judicial.',
  alternates: { canonical: '/blog/ruidos-vecinos-comunidad' },
  openGraph: {
    title: 'Ruidos de vecinos: cómo reclamar legalmente en 2026',
    description:
      'Pasos legales para resolver conflictos de ruido entre vecinos en una comunidad de propietarios.',
    url: 'https://fincahub.com/blog/ruidos-vecinos-comunidad',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Ruidos de vecinos en comunidad: qué hacer y cómo reclamar (2026)',
  description: 'Guía legal completa para reclamar por ruidos entre vecinos en una comunidad de propietarios.',
  author: { '@type': 'Organization', name: 'FincaHub' },
  publisher: { '@type': 'Organization', name: 'FincaHub', url: 'https://fincahub.com' },
  datePublished: '2026-03-14',
  dateModified: '2026-03-14',
  mainEntityOfPage: 'https://fincahub.com/blog/ruidos-vecinos-comunidad',
  inLanguage: 'es',
};

const STEPS = [
  { n: '01', title: 'Habla con el vecino', desc: 'Primer paso siempre: una conversación amistosa. El 60% de los conflictos se resuelven así. Ve con actitud tranquila y sin acusaciones.' },
  { n: '02', title: 'Comunicación escrita', desc: 'Si no funciona, envíale una nota escrita o email. Queda constancia y suele ser suficiente para que tome conciencia.' },
  { n: '03', title: 'Denuncia al presidente de la comunidad', desc: 'El presidente puede requerir formalmente al vecino que cese la actividad molesta (art. 7.2 LPH).' },
  { n: '04', title: 'Denuncia a la policía local', desc: 'Para ruidos nocturnos o que superen los límites legales. La policía puede levantar acta que sirve de prueba.' },
  { n: '05', title: 'Acción judicial', desc: 'Si todo lo anterior falla, la comunidad o el vecino afectado puede demandar por actividad molesta. Pueden ordenar el cese e incluso la privación del uso del piso.' },
];

export default function ArticleRuidos() {
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
          <span className="text-xs font-bold px-3 py-1 rounded-full text-purple-400 bg-purple-500/10 border border-purple-500/20">Convivencia</span>
          <span className="text-slate-500 text-xs ml-3">14 Mar 2026 · 6 min lectura</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black leading-tight mb-6">
          Ruidos de vecinos en comunidad: qué hacer y cómo reclamar (2026)
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10 border-l-4 border-purple-500/50 pl-5">
          El ruido es la causa número 1 de conflictos entre vecinos en España. Desde fiestas hasta obras, aquí tienes los pasos legales para solucionar el problema sin perder los nervios.
        </p>

        <div className="space-y-10 text-[15px] leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-4">¿Cuánto ruido está permitido?</h2>
            <p className="text-slate-300 mb-4">Los límites varían por municipio, pero la normativa general marca:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-5">
                <h3 className="font-bold text-purple-400 mb-3">Horario diurno (7h–23h)</h3>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Interior vivienda: <strong className="text-white">máx. 45 dB</strong></li>
                  <li>• Vía pública: <strong className="text-white">máx. 65 dB</strong></li>
                  <li>• Obras: permitidas con licencia</li>
                </ul>
              </div>
              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-5">
                <h3 className="font-bold text-indigo-400 mb-3">Horario nocturno (23h–7h)</h3>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Interior vivienda: <strong className="text-white">máx. 35 dB</strong></li>
                  <li>• Vía pública: <strong className="text-white">máx. 55 dB</strong></li>
                  <li>• Obras: <strong className="text-red-400">prohibidas</strong></li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-6">Qué hacer paso a paso</h2>
            <div className="space-y-4">
              {STEPS.map((s) => (
                <div key={s.n} className="flex gap-5 items-start bg-white/3 border border-white/8 rounded-xl p-5">
                  <span className="text-3xl font-black text-purple-400/30 leading-none mt-0.5 shrink-0">{s.n}</span>
                  <div>
                    <h3 className="font-bold text-white mb-1">{s.title}</h3>
                    <p className="text-slate-400 text-sm">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">El art. 7.2 de la LPH: tu mejor aliado</h2>
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-5">
              <p className="text-slate-300 text-sm italic mb-3">
                "Al propietario y al ocupante del piso o local no les está permitido desarrollar en él o en el resto del inmueble actividades prohibidas en los estatutos, que resulten dañosas para la finca o que contravengan las disposiciones generales sobre actividades molestas, insalubres, nocivas, peligrosas o ilícitas."
              </p>
              <p className="text-slate-400 text-xs">— Artículo 7.2, Ley de Propiedad Horizontal</p>
            </div>
            <p className="text-slate-300 mt-4">
              Bajo este artículo, el presidente puede requerir al vecino por escrito que cese la actividad. Si no lo hace, la comunidad puede llevar el caso al juzgado y solicitar incluso la <strong className="text-white">privación del uso del piso</strong> durante hasta 3 años.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Cómo documentar el problema (crucial para la vía judicial)</h2>
            <ul className="space-y-2 text-slate-300">
              {[
                'Diario de incidencias: fecha, hora y descripción del ruido',
                'Testigos: firma de otros vecinos afectados',
                'Grabaciones de audio/vídeo (desde tu vivienda)',
                'Medición con app de decibelios (como evidencia complementaria)',
                'Actas de la policía local si han intervenido',
                'Emails o cartas enviados al vecino sin respuesta',
              ].map((item) => (
                <li key={item} className="flex gap-3 items-start">
                  <span className="text-purple-400 mt-0.5 shrink-0">→</span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {[
                { q: '¿Puede la comunidad prohibir fiestas?', a: 'Los estatutos pueden regular los horarios de reuniones y el uso de zonas comunes. En zonas privativas (pisos) es más difícil salvo que superen los límites de ruido.' },
                { q: '¿Qué pasa con las obras que hace un vecino?', a: 'Necesitan comunicarse a la comunidad con antelación. Las obras que afecten a elementos estructurales necesitan autorización de la junta. Se permiten solo en horario diurno.' },
                { q: '¿El inquilino o el propietario es el responsable?', a: 'El inquilino es responsable de sus actos, pero el propietario también puede ser requerido ya que es quien cede el uso del inmueble.' },
              ].map(({ q, a }) => (
                <div key={q} className="bg-white/3 border border-white/8 rounded-xl p-5">
                  <h3 className="font-bold text-white mb-2">{q}</h3>
                  <p className="text-slate-400 text-sm">{a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-14 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-white/10 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-black mb-2">Registra las incidencias de tu comunidad digitalmente</h3>
          <p className="text-slate-400 text-sm mb-5">Con FincaHub puedes crear incidencias con fotos, asignar prioridad y llevar un historial completo. Ideal para documentar casos legales.</p>
          <Link href="/register" className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-8 py-3 rounded-xl transition">
            Empezar gratis 30 días →
          </Link>
        </div>
      </article>
    </div>
  );
}
