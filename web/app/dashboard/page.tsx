'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { API_URL } from '../../lib/api';

interface DashboardData {
  balance: number;
  pendingDebt: number;
  activeIncidents: number;
  totalNeighbors: number;
  recentTransactions: { description: string; amount: number; type: string; date: string }[];
  recentIncidents: { title: string; status: string; createdAt: string }[];
  upcomingBookings: { space: { name: string }; date: string; startTime: string }[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${API_URL}/accounting/accounts`, { headers }).then(r => r.ok ? r.json() : []),
      fetch(`${API_URL}/accounting/debt`, { headers }).then(r => r.ok ? r.json() : { total: 0 }),
      fetch(`${API_URL}/incidents`, { headers }).then(r => r.ok ? r.json() : []),
      fetch(`${API_URL}/community/neighbors`, { headers }).then(r => r.ok ? r.json() : []),
      fetch(`${API_URL}/bookings`, { headers }).then(r => r.ok ? r.json() : []),
    ]).then(([accounts, debt, incidents, neighbors, bookings]) => {
      const balance = Array.isArray(accounts) ? accounts.reduce((sum: number, a: { balance: number }) => sum + (a.balance || 0), 0) : 0;
      const activeIncidents = Array.isArray(incidents) ? incidents.filter((i: { status: string }) => i.status !== 'RESOLVED' && i.status !== 'CLOSED').length : 0;

      setData({
        balance,
        pendingDebt: debt?.total || 0,
        activeIncidents,
        totalNeighbors: Array.isArray(neighbors) ? neighbors.length : 0,
        recentTransactions: [],
        recentIncidents: Array.isArray(incidents) ? incidents.slice(0, 3) : [],
        upcomingBookings: Array.isArray(bookings) ? bookings.slice(0, 3) : [],
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const fmt = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const statusColor: Record<string, string> = {
    OPEN: 'text-red-400 bg-red-500/10',
    IN_PROGRESS: 'text-yellow-400 bg-yellow-500/10',
    RESOLVED: 'text-green-400 bg-green-500/10',
    CLOSED: 'text-gray-400 bg-gray-500/10',
  };
  const statusLabel: Record<string, string> = {
    OPEN: 'Abierta', IN_PROGRESS: 'En curso', RESOLVED: 'Resuelta', CLOSED: 'Cerrada',
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Resumen General</h2>
          <p className="text-gray-400 mt-1">Estado actual de tu comunidad</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/incidents" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors shadow-sm flex items-center gap-2">
            + Nueva Incidencia
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10 animate-pulse h-28" />
          ))
        ) : (
          <>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">Saldo en Cuenta</p>
              <h3 className="text-2xl font-bold text-white">{fmt(data?.balance || 0)} €</h3>
              <p className="text-xs mt-2 text-green-400 font-medium">💰 Saldo disponible</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">Deuda Pendiente</p>
              <h3 className="text-2xl font-bold text-white">{fmt(data?.pendingDebt || 0)} €</h3>
              <p className="text-xs mt-2 text-red-400 font-medium">⚠️ Por cobrar a vecinos</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">Incidencias Activas</p>
              <h3 className="text-2xl font-bold text-white">{data?.activeIncidents || 0}</h3>
              <p className="text-xs mt-2 text-yellow-400 font-medium">🔧 Sin resolver</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">Vecinos</p>
              <h3 className="text-2xl font-bold text-white">{data?.totalNeighbors || 0}</h3>
              <p className="text-xs mt-2 text-blue-400 font-medium">👥 En la comunidad</p>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Incidents */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Incidencias Recientes</h3>
            <Link href="/dashboard/incidents" className="text-sm text-blue-400 hover:underline">Ver todas →</Link>
          </div>
          <div className="space-y-4">
            {data?.recentIncidents?.length ? data.recentIncidents.map((inc: { title: string; status: string; createdAt: string }, i: number) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm font-medium text-white">{inc.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(inc.createdAt).toLocaleDateString('es-ES')}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor[inc.status] || 'text-gray-400'}`}>
                  {statusLabel[inc.status] || inc.status}
                </span>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">No hay incidencias activas</p>
            )}
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Próximas Reservas</h3>
            <Link href="/dashboard/bookings" className="text-sm text-blue-400 hover:underline">Ver todas →</Link>
          </div>
          <div className="space-y-4">
            {data?.upcomingBookings?.length ? data.upcomingBookings.map((b: { space: { name: string }; date: string; startTime: string }, i: number) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="text-sm font-medium text-white">{b.space?.name}</p>
                    <p className="text-xs text-gray-400">{new Date(b.date).toLocaleDateString('es-ES')} · {b.startTime}</p>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">No hay reservas próximas</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">Accesos Rápidos</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/dashboard/announcements', icon: '📢', label: 'Nuevo Anuncio' },
            { href: '/dashboard/voting', icon: '🗳️', label: 'Crear Votación' },
            { href: '/dashboard/meetings', icon: '📋', label: 'Convocar Junta' },
            { href: '/dashboard/accounts', icon: '📊', label: 'Ver Cuentas' },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 transition-all text-center"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-medium text-gray-300">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
