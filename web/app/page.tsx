import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 glass border-b border-white/10">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold">
              F
            </div>
            <span className="text-xl font-bold tracking-tight">Fincahub</span>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">Características</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Precios</Link>
            <Link href="#testimonials" className="hover:text-primary transition-colors">Testimonios</Link>
          </nav>

          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Acceder
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25"
            >
              Empezar Gratis
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium border border-secondary/20 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
                Nueva Versión 2.0 Disponible
              </div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] animate-slide-up">
                Gestión de Comunidades <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-secondary">
                  Sin Gravedad
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Empodera a tu comunidad con cuentas claras, votaciones online y gestión de incidencias automatizada. La herramienta definitiva para presidentes modernos.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <button className="h-12 px-8 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-xl hover:shadow-primary/20 hover:-translate-y-1">
                  Ver Demo Interactiva
                </button>
                <button className="h-12 px-8 rounded-full bg-white border border-border text-foreground font-medium hover:bg-zinc-50 transition-all hover:-translate-y-1">
                  Hablar con Ventas
                </button>
              </div>
            </div>

            {/* Hero Image / Dashboard Preview */}
            <div className="mt-20 relative mx-auto max-w-5xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden glass aspect-video animate-slide-up" style={{ animationDelay: '0.3s' }}>
              {/* Using native img tag or Next Image with the local path we copied */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
              <Image
                src="/hero.png"
                alt="Fincahub Dashboard Preview"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 opacity-40 pointer-events-none">
            <div className="absolute top-20 left-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl mix-blend-multiply filter"></div>
            <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl mix-blend-multiply filter"></div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Todo lo que tu comunidad necesita</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Olvídate de las hojas de cálculo y los grupos de WhatsApp caóticos. Centraliza todo en un solo lugar.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Cuentas Claras",
                  desc: "Conciliación bancaria automática y transparencia total para todos los vecinos.",
                  icon: "📊"
                },
                {
                  title: "Votaciones Seguras",
                  desc: "Sistema de voto telemático certificado. Toma decisiones sin reuniones eternas.",
                  icon: "🗳️"
                },
                {
                  title: "Incidencias al Día",
                  desc: "Reporte de averías con fotos y seguimiento en tiempo real. Adiós al 'no sabía nada'.",
                  icon: "🔧"
                },
                {
                  title: "Morosidad Cero",
                  desc: "Reclamación automática de deuda y cálculo de intereses según normativa.",
                  icon: "⚖️"
                },
                {
                  title: "Reservas",
                  desc: "Gestión de pádel, piscina y locales comunes sin conflictos ni libretas.",
                  icon: "📅"
                },
                {
                  title: "Gestor Documental",
                  desc: "Actas, facturas y contratos siempre accesibles en la nube segura.",
                  icon: "📁"
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow hover:translate-y-[-2px] duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-3xl mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>© 2026 Fincahub S.L. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
