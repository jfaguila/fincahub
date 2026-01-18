'use client';
import Link from 'next/link';

export default function Dashboard() {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Resumen General</h2>
                    <p className="text-muted-foreground mt-1">Bienvenido de nuevo, Presidente. Aquí tienes el estado de tu comunidad.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/documents" className="px-4 py-2 bg-white text-black border border-border rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors shadow-sm flex items-center gap-2">
                        <span>📥</span> Descargar Informe
                    </Link>
                    <Link href="/dashboard/incidents" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors shadow-sm flex items-center gap-2">
                        <span>+</span> Nueva Incidencia
                    </Link>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Saldo en Cuenta", value: "24.500,00 €", change: "+12% vs mes pasado", color: "text-green-600", bg: "bg-green-500/10" },
                    { label: "Recibos Pendientes", value: "1.250,00 €", change: "3 vecinos morosos", color: "text-red-500", bg: "bg-red-500/10" },
                    { label: "Incidencias Activas", value: "4", change: "2 urgentes", color: "text-amber-500", bg: "bg-amber-500/10" },
                    { label: "Próxima Junta", value: "15 Oct", change: "En 12 días", color: "text-blue-500", bg: "bg-blue-500/10" },
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-xl bg-card border border-border shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            <span className={`p-2 rounded-lg ${stat.bg} ${stat.color} text-xs font-bold`}>↗</span>
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                        <p className={`text-xs mt-2 font-medium ${stat.color}`}>{stat.change}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 p-6 rounded-xl bg-card border border-border shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Actividad Reciente</h3>
                    <div className="space-y-6">
                        {[
                            { action: "Pago Recibido", desc: "Piso 3ºA ha pagado la cuota de Octubre", time: "Hace 2h", icon: "💰" },
                            { action: "Nueva Incidencia", desc: "Bombilla fundida en portal", time: "Hace 5h", icon: "💡" },
                            { action: "Reserva Confirmada", desc: "Pista de Pádel - Sábado 18:00", time: "Hace 1d", icon: "🎾" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 pb-6 border-b border-border last:border-0 last:pb-0">
                                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">{item.action}</p>
                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                </div>
                                <span className="ml-auto text-xs text-muted-foreground">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions / Shortcuts */}
                <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Accesos Rápidos</h3>
                    <div className="space-y-3">
                        <Link href="/dashboard/documents" className="w-full text-left px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm font-medium flex items-center gap-3">
                            ✉️ Enviar Circular
                        </Link>
                        <Link href="/dashboard/accounts" className="w-full text-left px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm font-medium flex items-center gap-3">
                            📊 Ver Balance Trimestral
                        </Link>
                        <Link href="/dashboard/voting" className="w-full text-left px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm font-medium flex items-center gap-3">
                            🗳️ Crear Votación
                        </Link>
                    </div>

                    <div className="mt-8 p-4 rounded-lg bg-gradient-to-br from-primary to-blue-600 text-primary-foreground">
                        <p className="text-sm font-bold mb-1">¿Necesitas ayuda legal?</p>
                        <p className="text-xs opacity-90 mb-3">Consulta a nuestro asistente IA sobre la Ley de Propiedad Horizontal.</p>
                        <button
                            onClick={() => alert("🤖 Asistente IA (Demo Layer):\n\n'Según el Artículo 10 de la LPH, para instalar un ascensor se requiere mayoría simple...'")}
                            className="w-full py-1.5 bg-white/20 hover:bg-white/30 rounded text-xs font-semibold backdrop-blur-sm transition-colors"
                        >
                            Consultar IA
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
