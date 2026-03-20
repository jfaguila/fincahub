'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

interface Stats {
  total: number;
  active: number;
  trial: number;
  canceled: number;
  pastDue: number;
  totalUsers: number;
  mrr: number;
}

interface Community {
  id: string;
  name: string;
  city: string | null;
  province: string | null;
  subscriptionStatus: string;
  subscriptionPlan: string | null;
  trialEndsAt: string | null;
  subscriptionEndsAt: string | null;
  createdAt: string;
  userCount: number;
  incidentCount: number;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active:    { label: 'Activo',    color: 'bg-green-500/15 text-green-400 border-green-500/30' },
  trial:     { label: 'Trial',     color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  canceled:  { label: 'Cancelado', color: 'bg-red-500/15 text-red-400 border-red-500/30' },
  past_due:  { label: 'Impago',    color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
};

const PLAN_LABELS: Record<string, string> = {
  basic: 'Basic — 29€',
  professional: 'Pro — 59€',
  urbanization: 'Urbanización — 99€',
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-5">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-3xl font-bold text-white mt-1">{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}

export default function SuperAdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'ADMIN') {
      router.replace('/dashboard');
      return;
    }
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [statsRes, commRes] = await Promise.all([
        fetch(`${API_URL}/super-admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/super-admin/communities`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (commRes.ok) setCommunities(await commRes.json());
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`${API_URL}/super-admin/communities/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setCommunities(prev =>
          prev.map(c => c.id === id ? { ...c, subscriptionStatus: status } : c)
        );
      }
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = communities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.city || '').toLowerCase().includes(search.toLowerCase())
  );

  const trialExpiringSoon = communities.filter(c => {
    if (c.subscriptionStatus !== 'trial' || !c.trialEndsAt) return false;
    const daysLeft = Math.ceil((new Date(c.trialEndsAt).getTime() - Date.now()) / 86400000);
    return daysLeft <= 5 && daysLeft >= 0;
  });

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Super Admin</h2>
          <p className="text-gray-400 mt-1">Gestiona todas las comunidades de FincaHub</p>
        </div>
        <button
          onClick={fetchData}
          className="text-sm text-blue-400 hover:underline"
        >
          Actualizar
        </button>
      </div>

      {/* KPIs */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />)}
        </div>
      ) : stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Comunidades totales" value={stats.total} sub={`${stats.totalUsers} usuarios`} />
          <StatCard label="Pagando (activas)" value={stats.active} sub={`MRR estimado: ${stats.mrr}€`} />
          <StatCard label="En trial" value={stats.trial} sub="30 días gratis" />
          <StatCard label="Canceladas / Impago" value={stats.canceled + stats.pastDue} />
        </div>
      )}

      {/* Alert: trials expiring soon */}
      {trialExpiringSoon.length > 0 && (
        <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/30 p-4">
          <p className="text-yellow-400 font-medium text-sm mb-2">
            Trials a punto de expirar ({trialExpiringSoon.length})
          </p>
          <ul className="space-y-1">
            {trialExpiringSoon.map(c => {
              const daysLeft = Math.ceil((new Date(c.trialEndsAt!).getTime() - Date.now()) / 86400000);
              return (
                <li key={c.id} className="text-yellow-300/80 text-xs flex items-center gap-2">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-yellow-500">—</span>
                  <span>expira en {daysLeft} día{daysLeft !== 1 ? 's' : ''}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <input
            type="text"
            placeholder="Buscar por nombre o ciudad..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-500 text-sm">{filtered.length} resultados</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No hay comunidades registradas</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Comunidad</th>
                  <th className="text-left px-4 py-3">Plan</th>
                  <th className="text-left px-4 py-3">Estado</th>
                  <th className="text-left px-4 py-3">Usuarios</th>
                  <th className="text-left px-4 py-3">Trial / Fin</th>
                  <th className="text-left px-4 py-3">Alta</th>
                  <th className="text-left px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(c => {
                  const statusInfo = STATUS_LABELS[c.subscriptionStatus] || { label: c.subscriptionStatus, color: 'bg-gray-500/15 text-gray-400' };
                  const trialDate = c.trialEndsAt ? new Date(c.trialEndsAt).toLocaleDateString('es-ES') : null;
                  const endDate = c.subscriptionEndsAt ? new Date(c.subscriptionEndsAt).toLocaleDateString('es-ES') : null;
                  const createdDate = new Date(c.createdAt).toLocaleDateString('es-ES');

                  return (
                    <tr key={c.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-white font-medium">{c.name}</p>
                        {c.city && <p className="text-gray-500 text-xs">{c.city}{c.province ? `, ${c.province}` : ''}</p>}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {c.subscriptionPlan ? PLAN_LABELS[c.subscriptionPlan] || c.subscriptionPlan : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {c.userCount}
                        {c.incidentCount > 0 && (
                          <span className="ml-2 text-gray-500 text-xs">{c.incidentCount} incid.</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {trialDate ? `Trial: ${trialDate}` : endDate ? `Fin: ${endDate}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{createdDate}</td>
                      <td className="px-4 py-3">
                        <select
                          disabled={updatingId === c.id}
                          value={c.subscriptionStatus}
                          onChange={e => changeStatus(c.id, e.target.value)}
                          className="text-xs bg-white/10 text-white border border-white/20 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                        >
                          <option value="trial">Trial</option>
                          <option value="active">Activo</option>
                          <option value="past_due">Impago</option>
                          <option value="canceled">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
