'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_URL } from '../lib/api';

export default function TrialBanner() {
  const [banner, setBanner] = useState<{
    type: 'trial_ending' | 'trial_expired' | 'canceled' | null;
    daysLeft?: number;
  }>({ type: null });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${API_URL}/billing/status`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;

        if (data.subscriptionStatus === 'active') return; // paid, no banner

        if (data.subscriptionStatus === 'canceled') {
          setBanner({ type: 'canceled' });
          return;
        }

        if (data.subscriptionStatus === 'trial' && data.trialEndsAt) {
          const daysLeft = Math.ceil(
            (new Date(data.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );
          if (daysLeft <= 0) {
            setBanner({ type: 'trial_expired' });
          } else if (daysLeft <= 7) {
            setBanner({ type: 'trial_ending', daysLeft });
          }
        }
      })
      .catch(() => null);
  }, []);

  if (!banner.type) return null;

  const styles = {
    trial_ending: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
    trial_expired: 'bg-red-500/10 border-red-500/30 text-red-300',
    canceled: 'bg-red-500/10 border-red-500/30 text-red-300',
  };

  const messages = {
    trial_ending: `Tu periodo de prueba termina en ${banner.daysLeft} día${banner.daysLeft === 1 ? '' : 's'}. Activa un plan para no perder el acceso.`,
    trial_expired: 'Tu periodo de prueba ha terminado. Activa un plan para seguir usando Fincahub.',
    canceled: 'Tu suscripción ha sido cancelada. Activa un plan para recuperar el acceso.',
  };

  return (
    <div className={`mb-6 px-4 py-3 rounded-xl border flex items-center justify-between gap-4 ${styles[banner.type]}`}>
      <div className="flex items-center gap-2 text-sm">
        <span>{banner.type === 'trial_ending' ? '⏰' : '⚠️'}</span>
        <span>{messages[banner.type]}</span>
      </div>
      <Link
        href="/dashboard/billing"
        className="flex-shrink-0 px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-all"
      >
        Activar plan →
      </Link>
    </div>
  );
}
