'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import NotificationBell from "@/components/NotificationBell";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

function UserInfo() {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setName(user.name || user.fullName || 'Usuario');
                setRole(user.role || 'Vecino');
            }
        } catch {
            setName('Usuario');
            setRole('Vecino');
        }
    }, []);

    const initials = name
        ? name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">
                {initials}
            </div>
            <div className="text-sm">
                <p className="font-medium">{name || 'Cargando...'}</p>
                <p className="text-xs text-slate-400">{role}</p>
            </div>
        </div>
    );
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure';
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';
    window.location.replace('/login');
}

function AdminLink() {
    const [role, setRole] = useState('');
    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            setRole(user.role || '');
        } catch { /* ignore */ }
    }, []);
    if (!['ADMIN', 'PRESIDENT'].includes(role)) return null;
    return (
        <>
            <Link href="/dashboard/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                <span>⚙️</span> Administración
            </Link>
            {role === 'ADMIN' && (
                <Link href="/dashboard/super-admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                    <span>🛡️</span> Super Admin
                </Link>
            )}
        </>
    );
}

function TrialExpiredWall() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-3xl mb-6">
                🔒
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Tu período de prueba ha expirado</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
                Han pasado los 30 días de prueba gratuita. Elige un plan para seguir gestionando tu comunidad sin interrupciones.
            </p>
            <Link
                href="/dashboard/billing"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
            >
                Ver planes y precios
            </Link>
        </div>
    );
}

function SubscriptionWrapper({ children }: { children: React.ReactNode }) {
    const [expired, setExpired] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const user = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } })();
        if (user.role === 'ADMIN') { setChecked(true); return; }

        const token = localStorage.getItem('token');
        if (!token) { setChecked(true); return; }

        fetch(`${API_URL}/billing/status`, { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((data: any) => { if (data.subscriptionStatus === 'expired') setExpired(true); })
            .catch(() => { /* ignore, don't block on network error */ })
            .finally(() => setChecked(true));
    }, []);

    if (!checked) return null;

    // Always allow billing page so they can pay
    if (expired && typeof window !== 'undefined' && !window.location.pathname.includes('/billing')) {
        return <TrialExpiredWall />;
    }

    return <>{children}</>;
}

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
                    <Link href="/dashboard/announcements" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                        <span>📢</span> Anuncios
                    </Link>
                    <Link href="/dashboard/meetings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                        <span>📋</span> Juntas
                    </Link>
                    <Link href="/dashboard/billing" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                        <span>💳</span> Mi Plan
                    </Link>
                    <AdminLink />
                </nav>

                <div className="p-4 border-t border-white/10 space-y-3">
                    <UserInfo />
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-white/5 hover:text-red-400 transition-colors"
                    >
                        <span>🚪</span> Cerrar sesion
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 glass sticky top-0 z-10 px-6 flex items-center justify-between">
                    <h1 className="text-lg font-medium text-foreground">Panel de Control</h1>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                    </div>
                </header>
                <main className="flex-1 p-6 md:p-8">
                    <AuthGuard>
                        <SubscriptionWrapper>
                            {children}
                        </SubscriptionWrapper>
                    </AuthGuard>
                </main>
            </div>
        </div>
    );
}
