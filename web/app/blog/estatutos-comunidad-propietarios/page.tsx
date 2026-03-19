import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Estatutos de una comunidad de propietarios: qué son y cómo modificarlos (2026)',
  description:
    'Todo sobre los estatutos de comunidades de propietarios: contenido obligatorio, diferencias con el reglamento de régimen interior y cómo cambiarlos.',
  alternates: { canonical: '/blog/estatutos-comunidad-propietarios' },
  openGraph: {
    title: 'Estatutos comunidad de propietarios: guía completa 2026',
    description: 'Qué son los estatutos, qué deben incluir y cómo modificarlos según la LPH.',
    url: 'https://fincahub.com/blog/estatutos-comunidad-propietarios',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Estatutos de una comunidad de propietarios: qué son y cómo modificarlos (2026)',
  description: 'Guía completa sobre estatutos de comunidades de propietarios según la LPH.',
  author: { '@type': 'Organization', name: 'FincaHub' },
  publisher: { '@type': 'Organization', name: 'FincaHub', url: 'https://fincahub.com' },
  datePublished: '2026-03-12',
  dateModified: '2026-03-12',
  mainEntityOfPage: 'https://fincahub.com/blog/estatutos-comunidad-propietarios',
  inLanguage: 'es',
};

export default function ArticleEstatutos() {
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
          <span className="text-xs font-bold px-3 py-1 rounded-full text-teal-400 bg-teal-500/10 border border-teal-500/20">Legal</span>
          <span className="text-slate-500 text-xs ml-3">12 Mar 2026 · 8 min lectura</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black leading-tight mb-6">
          Estatutos de una comunidad de propietarios: qué son y cómo modificarlos (2026)
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10 border-l-4 border-teal-500/50 pl-5">
          Los estatutos son la "constitución" de tu comunidad. Muchos presidentes desconocen qué deben contener, cuándo obligatoriamente hay que seguirlos y cómo cambiarlos si ya no son adecuados.
        </p>

        <div className="space-y-10 text-[15px] leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-4">¿Qué son los estatutos de una comunidad?</h2>
            <p className="text-slate-300">
              Los estatutos son el <strong className="text-white">documento fundacional</strong> de la comunidad de propietarios. Regulan los derechos y obligaciones de los propietarios más allá de lo que dice la LPH. Se inscriben en el Registro de la Propiedad y vinculan a todos los propietarios, actuales y futuros.
            </p>
            <p className="text-slate-300 mt-3">
              No todas las comunidades tienen estatutos propios. Si no los hay, se aplica directamente la <strong className="text-white">Ley de Propiedad Horizontal</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Estatutos vs Reglamento de Régimen Interior</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-5">
                <h3 className="font-bold text-teal-400 mb-3">Estatutos</h3>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Se inscriben en el Registro de la Propiedad</li>
                  <li>• Vinculan a futuros compradores</li>
                  <li>• Modificar: <strong className="text-white">unanimidad</strong></li>
                  <li>• Afectan a derechos reales</li>
                </ul>
              </div>
              <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-5">
                <h3 className="font-bold text-cyan-400 mb-3">Reglamento Interior</h3>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• No va al Registro</li>
                  <li>• Regula el uso cotidiano</li>
                  <li>• Modificar: <strong className="text-white">mayoría simple</strong></li>
                  <li>• Horarios, mascotas, limpieza...</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">¿Qué pueden regular los estatutos?</h2>
            <ul className="space-y-2 text-slate-300">
              {[
                'Los coeficientes de participación de cada vivienda/local',
                'Limitaciones de uso de determinados pisos o locales (prohibir actividades comerciales, pisos turísticos...)',
                'Exoneración de ciertos gastos para locales o elementos privativos (ej: el local comercial no paga ascensor)',
                'Procedimientos específicos de votación o administración',
                'Normas sobre obras en elementos privativos',
                'Instalación de determinados servicios (antenas, paneles solares...)',
              ].map((item) => (
                <li key={item} className="flex gap-3 items-start">
                  <span className="text-teal-400 mt-0.5 shrink-0">✓</span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Cómo modificar los estatutos</h2>
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5 mb-4">
              <p className="text-red-400 font-semibold text-sm mb-1">Atención: modificar los estatutos requiere UNANIMIDAD</p>
              <p className="text-slate-300 text-sm">Es el acuerdo más difícil de conseguir en una comunidad. Un solo propietario puede bloquear el cambio. Sin embargo, los ausentes que no expresen su oposición en 30 días se consideran favorables.</p>
            </div>
            <div className="space-y-3">
              {[
                { n: '1', t: 'Propuesta en junta', d: 'Incluir la modificación en el orden del día con texto detallado del cambio propuesto' },
                { n: '2', t: 'Votación unánime', d: 'Todos los propietarios a favor (o silencio de los ausentes durante 30 días)' },
                { n: '3', t: 'Escritura pública', d: 'La modificación debe formalizarse ante notario' },
                { n: '4', t: 'Registro de la Propiedad', d: 'Inscripción de la modificación para que vincule a futuros compradores' },
              ].map((s) => (
                <div key={s.n} className="flex gap-4 items-start bg-white/3 border border-white/8 rounded-xl p-4">
                  <span className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-400 text-sm font-bold flex items-center justify-center shrink-0">{s.n}</span>
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
                { q: '¿Dónde puedo encontrar los estatutos de mi comunidad?', a: 'En el Registro de la Propiedad o, si son recientes, en la notaría donde se constituyó la comunidad. También pueden estar archivados con las escrituras de la vivienda.' },
                { q: '¿Los estatutos pueden prohibir los pisos turísticos?', a: 'Sí, desde la reforma de la LPH de 2019, los estatutos pueden limitar o prohibir el uso turístico de las viviendas. Requiere acuerdo de 3/5 partes (no unanimidad para esta medida concreta).' },
                { q: '¿Un inquilino está vinculado por los estatutos?', a: 'Sí, el propietario debe informar al inquilino de los estatutos y el reglamento interior. El incumplimiento por parte del inquilino puede generar responsabilidad para el propietario.' },
                { q: '¿Qué pasa si una comunidad no tiene estatutos?', a: 'Se aplica íntegramente la Ley de Propiedad Horizontal. Cualquier comunidad puede elaborar estatutos propios en cualquier momento con acuerdo unánime.' },
              ].map(({ q, a }) => (
                <div key={q} className="bg-white/3 border border-white/8 rounded-xl p-5">
                  <h3 className="font-bold text-white mb-2">{q}</h3>
                  <p className="text-slate-400 text-sm">{a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-14 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-white/10 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-black mb-2">Guarda todos los documentos de tu comunidad en la nube</h3>
          <p className="text-slate-400 text-sm mb-5">Estatutos, actas, contratos y reglamentos accesibles desde cualquier dispositivo, en todo momento.</p>
          <Link href="/register" className="inline-block bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold px-8 py-3 rounded-xl transition">
            Empezar gratis 30 días →
          </Link>
        </div>
      </article>
    </div>
  );
}
