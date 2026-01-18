import Link from "next/link";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col fixed h-full inset-y-0 z-20">
                <div className="h-16 flex items-center px-6 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold">
                            F
                        </div>
                        <span className="text-xl font-bold tracking-tight">Fincahub</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10 text-white font-medium transition-colors">
                        <span>🏠</span> Inicio
                    </Link>
                    <Link href="/dashboard/accounts" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                        <span>💶</span> Cuentas
                    </Link>
                    <Link href="/dashboard/neighbors" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                        <span>👥</span> Vecinos
                    </Link>
                    <Link href="/dashboard/incidents" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                        <span>⚠️</span> Incidencias
                    </Link>
                    <Link href="/dashboard/documents" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                        <span>📁</span> Documentos
                    </Link>
                    <Link href="/dashboard/bookings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                        <span>📅</span> Reservas
                    </Link>
                    <Link href="/dashboard/voting" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                        <span>🗳️</span> Votaciones
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">JD</div>
                        <div className="text-sm">
                            <p className="font-medium">Juan Dueño</p>
                            <p className="text-xs text-slate-400">Presidente</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 glass sticky top-0 z-10 px-6 flex items-center justify-between">
                    <h1 className="text-lg font-medium text-foreground">Panel de Control</h1>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            🔔 <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                        </button>
                    </div>
                </header>
                <main className="flex-1 p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
