import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cómo cobrar deudas a vecinos morosos sin ir al juzgado (2026)',
  description:
    'Guía legal paso a paso para reclamar deudas en comunidades de propietarios: carta de reclamación, acuerdo en junta y procedimiento monitorio.',
  alternates: { canonical: '/blog/cobrar-morosos-comunidad' },
  openGraph: {
    title: 'Cómo cobrar deudas a vecinos morosos sin ir al juzgado',
    description:
      'El proceso legal completo para reclamar deudas a propietarios morosos. Con plantillas descargables.',
    url: 'https://fincahub.com/blog/cobrar-morosos-comunidad',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cómo cobrar deudas a vecinos morosos sin ir al juzgado (2026)',
  description: 'Guía legal completa para reclamar deudas en comunidades de propietarios.',
  author: { '@type': 'Organization', name: 'FincaHub' },
  publisher: { '@type': 'Organization', name: 'FincaHub', url: 'https://fincahub.com' },
  datePublished: '2026-03-10',
  dateModified: '2026-03-10',
  mainEntityOfPage: 'https://fincahub.com/blog/cobrar-morosos-comunidad',
  inLanguage: 'es',
};

const STEPS = [
  { n: '01', title: 'Detecta la deuda', desc: 'Identifica quién debe y cuánto. Imprescindible tener la contabilidad al día.' },
  { n: '02', title: 'Carta de reclamación amistosa', desc: 'Primer contacto escrito. Sin amenazas, solo recordatorio formal de la deuda.' },
  { n: '03', title: 'Aprobación en junta', desc: 'La comunidad debe aprobar en junta ordinaria o extraordinaria el inicio de acciones.' },
  { n: '04', title: 'Requerimiento notarial o burofax', desc: 'Envío certificado que da validez legal a la reclamación. Coste ~€30.' },
  { n: '05', title: 'Procedimiento monitorio', desc: 'Si no paga, el abogado presenta demanda ante el juzgado. Sin juicio oral en la mayoría de casos.' },
];

export default function ArticleMorosos() {
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
          <span className="text-xs font-bold px-3 py-1 rounded-full text-red-400 bg-red-500/10 border border-red-500/20">Legal</span>
          <span className="text-slate-500 text-xs ml-3">10 Mar 2026 · 10 min lectura</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black leading-tight mb-6">
          Cómo cobrar deudas a vecinos morosos sin ir al juzgado (2026)
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10 border-l-4 border-red-500/50 pl-5">
          En España, más del 15% de los propietarios tiene algún recibo impagado en su comunidad. Aquí te contamos exactamente cómo reclamar esa deuda, cuándo necesitas abogado y cómo evitar llegar a los juzgados.
        </p>

        <div className="space-y-8 text-[15px] leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-4">¿Qué dice la Ley de Propiedad Horizontal sobre los morosos?</h2>
            <p className="text-slate-300">
              La <strong className="text-white">LPH (art. 21)</strong> permite a la comunidad reclamar judicialmente deudas sin necesidad de contratar abogado ni procurador si el importe es inferior a <strong className="text-white">€2.000</strong>. Por encima de esa cantidad, sí son necesarios.
            </p>
            <p className="text-slate-300 mt-3">
              El procedimiento habitual es el <strong className="text-white">proceso monitorio</strong>, que es rápido, barato y altamente efectivo. En más del 70% de los casos el moroso paga antes de que el juez dicte resolución.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-6">El proceso paso a paso</h2>
            <div className="space-y-4">
              {STEPS.map((s) => (
                <div key={s.n} className="flex gap-5 items-start">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/20 flex items-center justify-center text-red-400 font-black text-sm flex-shrink-0">
                    {s.n}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm mb-1">{s.title}</div>
                    <div className="text-slate-400 text-sm">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">La carta de reclamación: qué debe incluir</h2>
            <p className="text-slate-300">Una carta de reclamación efectiva debe contener:</p>
            <div className="bg-slate-900 border border-white/10 rounded-xl p-6 mt-4 font-mono text-sm text-slate-300 space-y-3">
              <p className="text-slate-500">// Estructura mínima</p>
              <p>1. Identificación del propietario moroso</p>
              <p>2. Importe exacto adeudado y período</p>
              <p>3. Fecha límite para el pago voluntario (15 días)</p>
              <p>4. IBAN de la cuenta comunitaria</p>
              <p>5. Advertencia de acciones legales si no paga</p>
              <p>6. Firma del presidente o administrador</p>
            </div>
            <p className="text-slate-400 text-sm mt-4">
              FincaHub genera esta carta automáticamente desde el panel de morosos con un clic.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">¿Puede el moroso asistir a la junta y votar?</h2>
            <p className="text-slate-300">
              <strong className="text-white">Sí puede asistir</strong>, pero con restricciones. Según la LPH, el propietario con deudas puede participar en la junta pero <strong className="text-white">no tiene derecho a voto</strong> salvo que haya impugnado la deuda ante notario o los tribunales.
            </p>
            <p className="text-slate-300 mt-3">
              Además, no puede ser elegido presidente ni formar parte de la junta directiva mientras mantenga la deuda.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Cuánto tiempo tarda en resolverse</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { fase: 'Carta amistosa', tiempo: '15-30 días', color: 'border-emerald-500/30 text-emerald-400' },
                { fase: 'Proceso monitorio', tiempo: '2-4 meses', color: 'border-yellow-500/30 text-yellow-400' },
                { fase: 'Ejecución forzosa', tiempo: '6-18 meses', color: 'border-red-500/30 text-red-400' },
              ].map((f) => (
                <div key={f.fase} className={`border ${f.color.split(' ')[0]} rounded-xl p-4 text-center`}>
                  <div className={`text-lg font-black ${f.color.split(' ')[1]} mb-1`}>{f.tiempo}</div>
                  <div className="text-slate-400 text-sm">{f.fase}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">El truco para que los morosos paguen antes: la transparencia</h2>
            <p className="text-slate-300">
              Las comunidades que publican mensualmente el estado de cuentas —incluidas las deudas— tienen un índice de morosidad <strong className="text-white">60% menor</strong> que las que solo informan en la junta anual. La transparencia genera presión social.
            </p>
            <p className="text-slate-300 mt-3">
              Con FincaHub, el saldo de cada propietario es visible en su portal personal en tiempo real. Muchos vecinos pagan solos sin necesidad de reclamación.
            </p>
          </section>

          <section className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-white/10 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-black mb-3">¿Tienes morosos en tu comunidad?</h3>
            <p className="text-slate-400 mb-6">FincaHub detecta morosos automáticamente y genera la carta de reclamación con un clic.</p>
            <Link href="/register" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-3 rounded-xl transition">
              Probar gratis 30 días →
            </Link>
          </section>
        </div>
      </article>
    </div>
  );
}
