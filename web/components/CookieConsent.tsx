'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-white/10 p-6 shadow-2xl flex flex-col sm:flex-row items-center gap-4">
          <p className="text-sm text-gray-300 flex-1">
            Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegacion y analizar
            el uso de la plataforma. Puedes consultar nuestra{' '}
            <Link href="/privacy" className="text-blue-400 hover:underline">
              politica de privacidad
            </Link>{' '}
            para mas informacion.
          </p>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={handleReject}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all"
            >
              Rechazar
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
