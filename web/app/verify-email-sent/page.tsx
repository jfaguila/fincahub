'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { API_URL } from '../../lib/api';

function VerifyEmailSentContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!email || loading) return;
    setLoading(true);
    try {
      await fetch(`${API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setResent(true);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">F</div>
          <span className="text-2xl font-bold text-white">Fincahub</span>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
          <div className="text-6xl mb-6">📧</div>
          <h1 className="text-2xl font-bold text-white mb-3">Revisa tu email</h1>
          <p className="text-gray-400 mb-2">
            Hemos enviado un enlace de verificación a:
          </p>
          <p className="text-blue-400 font-semibold mb-6">{email}</p>
          <p className="text-gray-500 text-sm mb-8">
            Haz clic en el enlace del email para confirmar tu cuenta y comenzar tu prueba gratuita de 30 días.
          </p>

          {resent ? (
            <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-300 text-sm mb-4">
              Email reenviado correctamente. Revisa tu bandeja de entrada.
            </div>
          ) : (
            <button
              onClick={handleResend}
              disabled={loading}
              className="w-full py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-sm disabled:opacity-50 mb-4"
            >
              {loading ? 'Enviando...' : '¿No lo has recibido? Reenviar email'}
            </button>
          )}

          <p className="text-gray-600 text-xs">
            ¿Email incorrecto?{' '}
            <Link href="/register" className="text-blue-400 hover:underline">
              Volver al registro
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailSentPage() {
  return (
    <Suspense>
      <VerifyEmailSentContent />
    </Suspense>
  );
}
