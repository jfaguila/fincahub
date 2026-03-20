'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/api';

interface HealthStatus {
  status: string;
  environment: string;
  services: {
    database: { ok: boolean; message: string };
    jwt: { ok: boolean; message: string };
    frontend: { ok: boolean; url: string | null; message: string };
    paypal: { ok: boolean; mode: string; plansConfigured: boolean; message: string };
    email: { ok: boolean; host: string | null; user: string | null; message: string };
    backups: { ok: boolean; dir: string; recent: { name: string; size: string; date: string }[]; message: string };
  };
  nextSteps: string[];
}

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
      ok ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
    }`}>
      {ok ? '✓ OK' : '✗ Error'}
    </span>
  );
}

export default function AdminPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [testEmail, setTestEmail] = useState('');
  const [emailResult, setEmailResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [backupResult, setBackupResult] = useState<string | null>(null);
  const [runningBackup, setRunningBackup] = useState(false);

  const fetchHealth = async () => {
    try {
      const res = await fetch(`${API_URL}/health`);
      if (res.ok) setHealth(await res.json());
    } catch {
      // ignore
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setTestEmail(user.email || '');
  }, []);

  const sendTestEmail = async () => {
    setSendingEmail(true);
    setEmailResult(null);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/test-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ to: testEmail }),
        signal: controller.signal,
      });
      setEmailResult(await res.json());
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        setEmailResult({ ok: false, message: 'Tiempo de espera agotado. Verifica la configuración SMTP en Railway.' });
      } else {
        setEmailResult({ ok: false, message: 'Error de conexión' });
      }
    } finally {
      clearTimeout(timeout);
      setSendingEmail(false);
    }
  };

  const triggerBackup = async () => {
    setRunningBackup(true);
    setBackupResult(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/backup`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBackupResult(data.message);
    } catch {
      setBackupResult('Error de conexión');
    } finally {
      setRunningBackup(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Panel de Administración</h2>
        <p className="text-gray-400 mt-1">Estado del sistema y herramientas de diagnóstico</p>
      </div>

      {/* Health status */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Estado del sistema</h3>
          <button onClick={() => { setLoadingHealth(true); fetchHealth(); }} className="text-xs text-blue-400 hover:underline">
            Actualizar
          </button>
        </div>

        {loadingHealth ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-10 rounded-lg bg-white/5 animate-pulse" />)}
          </div>
        ) : health ? (
          <div className="space-y-3">
            {Object.entries(health.services).map(([key, svc]) => (
              <div key={key} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-white/3 border border-white/5">
                <div>
                  <p className="text-white text-sm font-medium capitalize">{key}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{svc.message}</p>
                  {key === 'backups' && (svc as any).recent?.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {(svc as any).recent.map((b: any) => (
                        <p key={b.name} className="text-gray-500 text-xs">{b.name} — {b.size}</p>
                      ))}
                    </div>
                  )}
                </div>
                <StatusBadge ok={svc.ok} />
              </div>
            ))}

            {health.nextSteps.length > 0 && (
              <div className="mt-4 p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                <p className="text-yellow-400 text-sm font-medium mb-2">Pasos pendientes:</p>
                <ul className="space-y-1">
                  {health.nextSteps.map((s, i) => (
                    <li key={i} className="text-yellow-300/80 text-xs flex items-start gap-2">
                      <span className="mt-0.5">→</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No se pudo conectar con el servidor</p>
        )}
      </div>

      {/* Test email */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">Probar envío de email</h3>
        <p className="text-gray-400 text-sm">Envía un email de prueba para verificar que la configuración SMTP es correcta.</p>

        <div className="flex gap-3">
          <input
            type="email"
            value={testEmail}
            onChange={e => setTestEmail(e.target.value)}
            placeholder="destinatario@email.com"
            className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendTestEmail}
            disabled={sendingEmail || !testEmail}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-all disabled:opacity-50"
          >
            {sendingEmail ? 'Enviando...' : 'Enviar prueba'}
          </button>
        </div>

        {emailResult && (
          <div className={`p-3 rounded-lg text-sm ${
            emailResult.ok
              ? 'bg-green-500/10 border border-green-500/20 text-green-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            {emailResult.message}
          </div>
        )}

        <div className="p-4 rounded-lg bg-white/3 border border-white/5">
          <p className="text-gray-400 text-xs font-medium mb-2">Variables necesarias en Railway:</p>
          <div className="space-y-1 font-mono text-xs text-gray-500">
            <p>MAIL_HOST=smtp.gmail.com</p>
            <p>MAIL_PORT=587</p>
            <p>MAIL_USER=tu@gmail.com</p>
            <p>MAIL_PASS=xxxx xxxx xxxx xxxx  <span className="text-gray-600">(App Password de Google)</span></p>
            <p>MAIL_FROM=FincaHub &lt;noreply@fincahub.com&gt;</p>
          </div>
          <p className="text-gray-500 text-xs mt-2">
            Crea el App Password en: Google Account → Seguridad → Contraseñas de aplicación
          </p>
        </div>
      </div>

      {/* Manual backup */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">Backup manual</h3>
        <p className="text-gray-400 text-sm">
          El backup automático se ejecuta cada día a las 03:00 UTC. También puedes lanzarlo manualmente.
        </p>

        <button
          onClick={triggerBackup}
          disabled={runningBackup}
          className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all disabled:opacity-50"
        >
          {runningBackup ? 'Creando backup...' : '🗄️ Lanzar backup ahora'}
        </button>

        {backupResult && (
          <p className="text-sm text-gray-300 bg-white/5 p-3 rounded-lg">{backupResult}</p>
        )}
      </div>
    </div>
  );
}
