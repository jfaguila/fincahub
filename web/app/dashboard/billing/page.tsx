'use client';
import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/api';

interface BillingStatus {
  status: 'trial' | 'active' | 'canceled';
  plan?: string;
  trialEndsAt?: string;
}

const PLANS = [
  {
    key: 'basic',
    name: 'Basico',
    price: '14,99',
    desc: 'Para comunidades pequenas',
    features: [
      'Hasta 30 viviendas',
      'Cuentas y contabilidad',
      'Gestion de incidencias',
      'Reserva de espacios',
      'Tablon de anuncios',
      'Gestor documental',
      'Soporte por email',
    ],
  },
  {
    key: 'professional',
    name: 'Profesional',
    price: '29,99',
    desc: 'El mas popular',
    highlight: true,
    features: [
      'Hasta 100 viviendas',
      'Todo lo del plan Basico',
      'Votaciones online',
      'Convocatorias de junta',
      'Reclamacion de deuda',
      'Notificaciones por email',
      'Soporte prioritario',
    ],
  },
  {
    key: 'urbanization',
    name: 'Urbanizacion',
    price: '59,99',
    desc: 'Para grandes comunidades',
    features: [
      'Viviendas ilimitadas',
      'Todo lo del plan Profesional',
      'Multiples portales/bloques',
      'Informes avanzados',
      'API de integracion',
      'Gestor de proveedores',
      'Soporte telefonico 24/7',
    ],
  },
];

export default function BillingPage() {
  const [billingStatus, setBillingStatus] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${API_URL}/billing/status`, { headers }).then(r => r.ok ? r.json() : null),
      fetch(`${API_URL}/billing/plans`, { headers }).then(r => r.ok ? r.json() : null),
    ])
      .then(([status]) => {
        if (status) setBillingStatus(status);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCheckout = async (planKey: string) => {
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
      } else if (data.demo) {
        alert('Sistema de pagos PayPal en configuracion. Contacta con hola@fincahub.es');
      }
    } catch {
      alert('Error al procesar el pago. Intentalo de nuevo.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Mi Plan</h2>
        <p className="text-gray-400 mt-1">Gestiona tu suscripcion</p>
      </div>

      {/* Current Status */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">Estado de la suscripcion</h3>
        {loading ? (
          <div className="h-12 animate-pulse bg-white/5 rounded-lg" />
        ) : billingStatus ? (
          <div className="flex items-center gap-4">
            {billingStatus.status === 'trial' && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-semibold text-lg">Periodo de prueba</span>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/10 text-yellow-400">
                    Prueba
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  Estas en el periodo de prueba gratuito de 30 dias
                </p>
              </div>
            )}
            {billingStatus.status === 'active' && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-semibold text-lg">
                    Plan {billingStatus.plan || 'Activo'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-400">
                    Activa
                  </span>
                </div>
                <p className="text-gray-400 text-sm">Tu plan esta activo y funcionando</p>
              </div>
            )}
            {billingStatus.status === 'canceled' && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-semibold text-lg">Suscripcion</span>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-500/10 text-red-400">
                    Cancelada
                  </span>
                </div>
                <p className="text-gray-400 text-sm">Tu suscripcion ha sido cancelada</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No se pudo cargar el estado de la suscripcion</p>
        )}
      </div>

      {/* Plans */}
      <div>
        <h3 className="text-lg font-bold text-white mb-6">Planes disponibles</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const isCurrentPlan =
              billingStatus?.status === 'active' &&
              billingStatus.plan?.toLowerCase() === plan.key;
            return (
              <div
                key={plan.key}
                className={`relative rounded-xl p-6 border flex flex-col ${
                  isCurrentPlan
                    ? 'bg-blue-600/10 border-blue-500 ring-1 ring-blue-500/50'
                    : plan.highlight
                    ? 'bg-white/5 border-blue-500/50'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                    PLAN ACTUAL
                  </div>
                )}
                {!isCurrentPlan && plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-yellow-400 text-black text-xs font-bold rounded-full">
                    MAS POPULAR
                  </div>
                )}
                <div className="mb-5">
                  <h4 className="text-lg font-bold text-white mb-1">{plan.name}</h4>
                  <p className="text-sm text-gray-400 mb-3">{plan.desc}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-white">{plan.price}&euro;</span>
                    <span className="text-sm text-gray-400 pb-1">/mes</span>
                  </div>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">&#10003;</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCheckout(plan.key)}
                  disabled={isCurrentPlan || checkoutLoading === plan.key}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    isCurrentPlan
                      ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-500 hover:-translate-y-0.5'
                  }`}
                >
                  {checkoutLoading === plan.key
                    ? 'Procesando...'
                    : isCurrentPlan
                    ? 'Plan actual'
                    : 'Seleccionar plan'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
