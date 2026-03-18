'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '../../lib/api';

const STEPS = ['Bienvenida', 'Tu comunidad', 'Elige plan'];

const PLANS = [
  {
    key: 'basic',
    name: 'Básico',
    price: '14,99',
    desc: 'Hasta 30 viviendas',
    features: ['Cuentas y contabilidad', 'Gestión de incidencias', 'Reservas y documentos', 'Soporte por email'],
  },
  {
    key: 'professional',
    name: 'Profesional',
    price: '29,99',
    desc: 'Hasta 100 viviendas',
    highlight: true,
    features: ['Todo lo del Básico', 'Votaciones online', 'Convocatorias de junta', 'Reclamación de deuda', 'Soporte prioritario'],
  },
  {
    key: 'urbanization',
    name: 'Urbanización',
    price: '59,99',
    desc: 'Ilimitado',
    features: ['Todo lo del Profesional', 'Múltiples portales', 'Informes avanzados', 'Soporte telefónico 24/7'],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [cif, setCif] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [saving, setSaving] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const saveAndNext = async () => {
    if (step === 1) {
      setSaving(true);
      try {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/community`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ address, postalCode, city, province, cif, bankAccount }),
        });
      } catch {
        // Non-blocking, can configure later
      } finally {
        setSaving(false);
      }
    }
    setStep(s => s + 1);
  };

  const handlePlanSelect = async (planKey: string) => {
    setCheckoutLoading(planKey);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/billing/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        // PayPal not configured (dev mode) — go to dashboard anyway
        router.push('/dashboard');
      }
    } catch {
      router.push('/dashboard');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const skipToDashboard = () => router.push('/dashboard');

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">F</div>
            <span className="text-2xl font-bold text-white">Fincahub</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`flex items-center gap-2`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < step ? 'bg-green-500 text-white' : i === step ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-500'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-sm ${i === step ? 'text-white font-medium' : 'text-gray-500'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`w-12 h-px ${i < step ? 'bg-green-500' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center">
            <div className="text-6xl mb-6">🏠</div>
            <h1 className="text-3xl font-bold text-white mb-3">¡Bienvenido a Fincahub!</h1>
            <p className="text-gray-400 mb-2">Tu comunidad está lista. En 2 pasos más tendrás todo configurado.</p>
            <p className="text-gray-500 text-sm mb-8">Tienes <span className="text-yellow-400 font-semibold">30 días gratis</span> para probar todas las funciones.</p>

            <div className="grid grid-cols-3 gap-4 mb-8 text-center">
              {[
                { icon: '💶', text: 'Cuentas transparentes' },
                { icon: '⚠️', text: 'Gestión de incidencias' },
                { icon: '🗳️', text: 'Votaciones online' },
              ].map((f, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-3xl mb-2">{f.icon}</div>
                  <p className="text-gray-300 text-xs">{f.text}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setStep(1)} className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all">
              Empezar configuración →
            </button>
            <button onClick={skipToDashboard} className="mt-3 text-gray-500 text-sm hover:text-gray-400 transition-colors">
              Saltar y configurar después
            </button>
          </div>
        )}

        {/* Step 1: Community setup */}
        {step === 1 && (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
            <h2 className="text-2xl font-bold text-white mb-1">Configura tu comunidad</h2>
            <p className="text-gray-400 text-sm mb-6">Esta información aparece en los documentos y comunicaciones. Puedes completarla después.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Dirección</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Ej: C/ Gran Vía, 45"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Código postal</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    placeholder="28013"
                    maxLength={5}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Población</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Madrid"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Provincia</label>
                  <input
                    type="text"
                    value={province}
                    onChange={e => setProvince(e.target.value)}
                    placeholder="Madrid"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    CIF <span className="text-gray-500 font-normal">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={cif}
                    onChange={e => setCif(e.target.value)}
                    placeholder="H28123456"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  IBAN cuenta bancaria <span className="text-gray-500 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={e => setBankAccount(e.target.value)}
                  placeholder="ES76 2100 0418 4502 0005 1332"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <p className="text-gray-500 text-xs mt-1">Para recibos y reclamaciones de deuda SEPA.</p>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={skipToDashboard} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-all text-sm">
                Saltar
              </button>
              <button
                onClick={saveAndNext}
                disabled={saving}
                className="flex-2 flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Continuar →'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Choose plan */}
        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Elige tu plan</h2>
              <p className="text-gray-400 text-sm">Los primeros 30 días son gratis en todos los planes. Sin tarjeta hasta que decidas continuar.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {PLANS.map((plan) => (
                <div
                  key={plan.key}
                  className={`relative rounded-xl p-5 border flex flex-col ${
                    plan.highlight
                      ? 'bg-blue-600/20 border-blue-500'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-yellow-400 text-black text-xs font-bold rounded-full">
                      MÁS POPULAR
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-white font-bold">{plan.name}</h3>
                    <p className="text-gray-400 text-xs mb-2">{plan.desc}</p>
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-bold text-white">{plan.price}€</span>
                      <span className="text-gray-400 text-xs pb-0.5">/mes</span>
                    </div>
                  </div>
                  <ul className="space-y-1.5 flex-1 mb-4">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-1.5 text-xs text-gray-300">
                        <span className="text-green-400">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handlePlanSelect(plan.key)}
                    disabled={checkoutLoading === plan.key}
                    className={`w-full py-2 rounded-lg font-semibold text-sm transition-all ${
                      plan.highlight
                        ? 'bg-blue-600 text-white hover:bg-blue-500'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    } disabled:opacity-50`}
                  >
                    {checkoutLoading === plan.key ? 'Procesando...' : 'Empezar gratis'}
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button onClick={skipToDashboard} className="text-gray-500 text-sm hover:text-gray-400 transition-colors">
                Continuar en periodo de prueba → ir al dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
