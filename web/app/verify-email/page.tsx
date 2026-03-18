'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { API_URL } from '../../lib/api';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('Enlace de verificación inválido.');
      return;
    }

    fetch(`${API_URL}/auth/verify-email?token=${token}`)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          document.cookie = `token=${data.token}; path=/; max-age=604800; secure; samesite=strict`;
          setStatus('success');
          setTimeout(() => router.push('/onboarding'), 2000);
        } else {
          const data = await res.json();
          setStatus('error');
          setErrorMsg(data.message || 'El enlace no es válido o ha expirado.');
        }
      })
      .catch(() => {
        setStatus('error');
        setErrorMsg('Error de conexión. Inténtalo de nuevo.');
      });
  }, [token, router]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">F</div>
          <span className="text-2xl font-bold text-white">Fincahub</span>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
          {status === 'loading' && (
            <>
              <div className="text-5xl mb-6 animate-pulse">⏳</div>
              <h1 className="text-xl font-bold text-white mb-3">Verificando tu email...</h1>
              <p className="text-gray-400 text-sm">Un momento, por favor.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-5xl mb-6">✅</div>
              <h1 className="text-2xl font-bold text-white mb-3">¡Email verificado!</h1>
              <p className="text-gray-400 text-sm">Tu cuenta está activa. Redirigiendo al onboarding...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-5xl mb-6">❌</div>
              <h1 className="text-2xl font-bold text-white mb-3">Enlace inválido</h1>
              <p className="text-gray-400 text-sm mb-6">{errorMsg}</p>
              <a
                href="/register"
                className="inline-block py-3 px-6 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all"
              >
                Volver al registro
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
