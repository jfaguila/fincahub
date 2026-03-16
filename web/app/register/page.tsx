'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_URL } from '../../lib/api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [communityName, setCommunityName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, communityName, role: 'PRESIDENT' }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Set token cookie for middleware auth
        document.cookie = `token=${data.token}; path=/; max-age=604800; secure; samesite=strict`;

        router.push('/dashboard');
        router.refresh();
      } else if (res.status === 409) {
        setError('Ya existe una cuenta con este email. Prueba a iniciar sesión.');
      } else if (res.status === 422) {
        setError(data.message || 'Datos inválidos. Revisa los campos e inténtalo de nuevo.');
      } else {
        setError(data.message || 'Error al crear la cuenta');
      }
    } catch {
      setError('Error de conexión con el servidor. Inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0f]">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold">F</div>
          <span className="text-xl font-bold text-white">Fincahub</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white mb-6">30 días gratis.<br />Sin tarjeta.<br />Sin permanencia.</h2>
          <div className="space-y-4">
            {[
              '✓ Cuentas y contabilidad en tiempo real',
              '✓ Votaciones y convocatorias online',
              '✓ Gestión de incidencias con fotos',
              '✓ Reserva de espacios sin conflictos',
              '✓ Tablón de anuncios para vecinos',
              '✓ Reclamación automática de morosos',
            ].map((item, i) => (
              <p key={i} className="text-blue-100 text-sm">{item}</p>
            ))}
          </div>
        </div>
        <p className="text-blue-200 text-sm">© 2026 Fincahub S.L.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Crea tu cuenta</h1>
            <p className="text-gray-400">30 días gratis, sin tarjeta de crédito</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Tu nombre</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Juan García"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre de tu comunidad</label>
              <input
                type="text"
                value={communityName}
                onChange={e => setCommunityName(e.target.value)}
                placeholder="Ej: Residencial Las Palmeras"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Contraseña <span className="text-gray-500 font-normal">(mínimo 8 caracteres)</span></label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Mínimo 8 caracteres"
                minLength={8}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-blue-600 text-white font-bold text-lg hover:bg-blue-500 transition-all disabled:opacity-50 shadow-xl shadow-blue-500/20"
            >
              {loading ? 'Creando cuenta...' : 'Empezar 30 días gratis →'}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Al registrarte aceptas nuestros{' '}
              <a href="#" className="text-blue-400 hover:underline">Términos de uso</a>{' '}
              y{' '}
              <a href="#" className="text-blue-400 hover:underline">Política de privacidad</a>
            </p>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-blue-400 hover:underline font-medium">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
