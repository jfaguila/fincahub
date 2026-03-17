'use client';

import { useState } from 'react';
import Link from 'next/link';
import { API_URL } from '../../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSent(true);
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
          <h1 className="text-2xl font-bold text-white">¿Olvidaste tu contraseña?</h1>
          <p className="text-gray-400 mt-2 text-sm">Introduce tu email y te enviaremos un enlace para restablecerla.</p>
        </div>

        {sent ? (
          <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
            <div className="text-4xl mb-3">📧</div>
            <h2 className="text-white font-bold mb-2">Email enviado</h2>
            <p className="text-gray-400 text-sm">
              Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña en unos minutos.
            </p>
            <p className="text-gray-500 text-xs mt-3">Revisa también la carpeta de spam.</p>
            <Link href="/login" className="inline-block mt-4 text-blue-400 hover:underline text-sm">
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>

            <p className="text-center text-gray-500 text-sm">
              <Link href="/login" className="text-blue-400 hover:underline">Volver al inicio de sesión</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
