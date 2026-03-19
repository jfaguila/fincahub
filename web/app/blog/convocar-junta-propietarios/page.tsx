import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cómo convocar una junta de propietarios paso a paso (2026)',
  description:
    'Guía completa para convocar una junta de propietarios: plazos legales, convocatoria por escrito, orden del día y qué dice la Ley de Propiedad Horizontal.',
  alternates: { canonical: '/blog/convocar-junta-propietarios' },
  openGraph: {
    title: 'Cómo convocar una junta de propietarios paso a paso (2026)',
    description:
      'Plazos, requisitos y modelo de convocatoria para juntas ordinarias y extraordinarias según la LPH.',
    url: 'https://fincahub.com/blog/convocar-junta-propietarios',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cómo convocar una junta de propietarios paso a paso (2026)',
  description: 'Guía completa para convocar juntas ordinarias y extraordinarias según la LPH.',
  author: { '@type': 'Organization', name: 'FincaHub' },
  publisher: { '@type': 'Organization', name: 'FincaHub', url: 'https://fincahub.com' },
  datePublished: '2026-03-18',
  dateModified: '2026-03-18',
  mainEntityOfPage: 'https://fincahub.com/blog/convocar-junta-propietarios',
  inLanguage: 'es',
};

const STEPS = [
  { n: '01', title: 'Decidir el tipo de junta', desc: 'Ordinaria (mínimo 1 vez al año para aprobar cuentas y presupuesto) o Extraordinaria (cuando surge una necesidad urgente).' },
  { n: '02', title: 'Elaborar el orden del día', desc: 'Lista los puntos a tratar. Solo se pueden votar asuntos incluidos en el orden del día. Añade siempre "Ruegos y preguntas".' },
  { n: '03', title: 'Enviar la convocatoria', desc: 'Con al menos 6 días naturales de antelación (junta ordinaria) o 24-48h si es urgente. Por escrito: burofax, email o entrega en mano.' },
  { n: '04', title: 'Celebrar la junta', desc: 'Primera convocatoria: quórum necesario. Segunda convocatoria (30 min después): válida con cualquier número de asistentes.' },
  { n: '05', title: 'Redactar el acta', desc: 'El secretario redacta el acta con los acuerdos adoptados. Debe aprobarse y firmarse. FincaHub lo hace automáticamente.' },
];

export default function ArticleJunta() {
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
          <span className="text-xs font-bold px-3 py-1 rounded-full text-green-400 bg-green-500/10 border border-green-500/20">Legal</span>
          <span className="text-slate-500 text-xs ml-3">18 Mar 2026 · 9 min lectura</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black leading-tight mb-6">
          Cómo convocar una junta de propietarios paso a paso (2026)
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10 border-l-4 border-green-500/50 pl-5">
          Una convocatoria mal hecha puede anular todos los acuerdos adoptados. Aquí tienes la guía definitiva para hacerlo bien según la Ley de Propiedad Horizontal, con modelo de convocatoria incluido.
        </p>

        <div className="space-y-10 text-[15px] leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Tipos de junta: ordinaria vs extraordinaria</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5">
                <h3 className="font-bold text-green-400 mb-2">Junta Ordinaria</h3>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Mínimo 1 vez al año</li>
                  <li>• Aprobación de cuentas</li>
                  <li>• Aprobación del presupuesto</li>
                  <li>• Elección de cargos</li>
                  <li>• Plazo: 6 días naturales de antelación</li>
                </ul>
              </div>
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
                <h3 className="font-bold text-blue-400 mb-2">Junta Extraordinaria</h3>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Cuando lo exija la situación</li>
                  <li>• Obras urgentes, conflictos</li>
                  <li>• La puede pedir el 25% de propietarios</li>
                  <li>• Sin plazo mínimo legalmente fijado</li>
                  <li>• Recomendado: 48-72h de antelación</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-6">El proceso paso a paso</h2>
            <div className="space-y-4">
              {STEPS.map((s) => (
                <div key={s.n} className="flex gap-5 items-start bg-white/3 border border-white/8 rounded-xl p-5">
                  <span className="text-3xl font-black text-green-400/30 leading-none mt-0.5 shrink-0">{s.n}</span>
                  <div>
                    <h3 className="font-bold text-white mb-1">{s.title}</h3>
                    <p className="text-slate-400 text-sm">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Modelo de convocatoria (copia y pega)</h2>
            <div className="bg-slate-900 border border-white/10 rounded-xl p-6 font-mono text-sm text-slate-300 whitespace-pre-line">
{`COMUNIDAD DE PROPIETARIOS
[Nombre de la comunidad]
[Dirección]

[Ciudad], [Fecha]

Estimado/a propietario/a,

De acuerdo con lo establecido en el art. 16 de la Ley de Propiedad
Horizontal, se convoca JUNTA ORDINARIA DE PROPIETARIOS que tendrá
lugar el día [FECHA] a las [HORA] horas en [LUGAR].

ORDEN DEL DÍA:

1. Aprobación del acta de la junta anterior.
2. Aprobación de las cuentas del ejercicio [AÑO].
3. Aprobación del presupuesto para el ejercicio [AÑO+1].
4. Renovación o ratificación de cargos.
5. Ruegos y preguntas.

En caso de no poder asistir, puede delegar su voto mediante
escrito dirigido al Presidente.

Atentamente,
[Nombre del Presidente/Administrador]`}
            </div>
            <p className="text-slate-500 text-xs mt-3">* Adapta los datos al nombre real de tu comunidad y envíalo con al menos 6 días de antelación.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Quórum: ¿cuántos vecinos necesito?</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Tipo de acuerdo</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">Mayoría necesaria</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ['Actos de administración ordinaria', '50% de propietarios y cuotas'],
                    ['Obras de mejora', '3/5 del total de propietarios y cuotas'],
                    ['Nuevos servicios o instalaciones', '3/5 del total'],
                    ['Modificar estatutos', 'Unanimidad'],
                    ['Cerrar la comunidad a no propietarios', 'Unanimidad'],
                  ].map(([acuerdo, mayoria]) => (
                    <tr key={acuerdo} className="hover:bg-white/2">
                      <td className="py-3 px-4 text-slate-300">{acuerdo}</td>
                      <td className="py-3 px-4 text-green-400 font-medium">{mayoria}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {[
                { q: '¿Se puede convocar la junta por WhatsApp?', a: 'No tiene validez legal si no hay acuerdo previo de todos los propietarios. Lo más seguro es el email con acuse de recibo, burofax o entrega en mano con firma.' },
                { q: '¿Qué pasa si un propietario no recibe la convocatoria?', a: 'Si se convoca en el tablón de anuncios con 3 días de antelación, tiene validez legal aunque no llegue individualmente al propietario.' },
                { q: '¿Puede un inquilino asistir a la junta?', a: 'Solo si el propietario le delega su voto por escrito. Los inquilinos no tienen voto en la junta de propietarios.' },
                { q: '¿Cuánto tiempo tengo para redactar el acta?', a: 'La LPH no fija un plazo concreto, pero se recomienda hacerla en los 10 días siguientes a la junta.' },
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
        <div className="mt-14 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-white/10 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-black mb-2">Convoca tu próxima junta desde FincaHub</h3>
          <p className="text-slate-400 text-sm mb-5">Envía la convocatoria por email a todos los vecinos en un clic. El acta se genera automáticamente.</p>
          <Link href="/register" className="inline-block bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-bold px-8 py-3 rounded-xl transition">
            Empezar gratis 30 días →
          </Link>
        </div>
      </article>
    </div>
  );
}
