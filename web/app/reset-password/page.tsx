'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { API_URL } from '../../lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) setError('Enlace no válido. Solicita uno nuevo.');
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        const data = await res.json();
        setError(data.message || 'El enlace no es válido o ha expirado.');
      }
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">F</div>
            <span className="text-xl font-bold text-white">Fincahub</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Nueva contraseña</h1>
          <p className="text-gray-400 mt-2 text-sm">Elige una contraseña segura para tu cuenta.</p>
        </div>

        {success ? (
          <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-white font-bold mb-2">Contraseña actualizada</h2>
            <p className="text-gray-400 text-sm">Redirigiendo al inicio de sesión...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Nueva contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Mínimo 8 caracteres"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirmar contraseña</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                placeholder="Repite la contraseña"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
