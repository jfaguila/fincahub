'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

interface Vivienda {
  id: number;
  nombre: string;
  coeficiente: string;
}

const DEFAULT_VIVIENDAS: Vivienda[] = [
  { id: 1, nombre: 'Piso 1A', coeficiente: '5.5' },
  { id: 2, nombre: 'Piso 1B', coeficiente: '4.8' },
  { id: 3, nombre: 'Piso 2A', coeficiente: '5.5' },
  { id: 4, nombre: 'Piso 2B', coeficiente: '4.8' },
  { id: 5, nombre: 'Local 1', coeficiente: '3.2' },
];

export default function CalculadoraPage() {
  const [gastoAnual, setGastoAnual] = useState('12000');
  const [viviendas, setViviendas] = useState<Vivienda[]>(DEFAULT_VIVIENDAS);
  const [calculado, setCalculado] = useState(false);

  const totalCoef = viviendas.reduce((s, v) => s + (parseFloat(v.coeficiente) || 0), 0);
  const gasto = parseFloat(gastoAnual) || 0;

  const calcularCuota = useCallback((coef: string) => {
    const c = parseFloat(coef) || 0;
    if (totalCoef === 0) return 0;
    return (gasto * c) / totalCoef;
  }, [gasto, totalCoef]);

  const addVivienda = () => {
    setViviendas(prev => [...prev, { id: Date.now(), nombre: `Piso ${prev.length + 1}`, coeficiente: '5' }]);
    setCalculado(false);
  };

  const removeVivienda = (id: number) => {
    if (viviendas.length <= 2) return;
    setViviendas(prev => prev.filter(v => v.id !== id));
    setCalculado(false);
  };

  const updateVivienda = (id: number, field: 'nombre' | 'coeficiente', value: string) => {
    setViviendas(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
    setCalculado(false);
  };

  const handleCalcular = () => {
    if (totalCoef <= 0 || gasto <= 0) return;
    setCalculado(true);
  };

  const fmt = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          FincaHub
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/blog" className="text-slate-400 hover:text-white text-sm transition">Blog</Link>
          <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition">
            Empezar gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 py-14 text-center">
        <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
          Herramienta gratuita
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-4">
          Calculadora de cuotas de comunidad
        </h1>
        <p className="text-slate-400 text-lg">
          Introduce el gasto anual y los coeficientes de participación. Calcula al instante cuánto paga cada propietario.
        </p>
      </section>

      {/* Calculadora */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        {/* Gasto anual */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-5">
          <label className="block text-sm font-bold text-white mb-3">
            Gasto anual total de la comunidad (€)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">€</span>
            <input
              type="number"
              value={gastoAnual}
              onChange={e => { setGastoAnual(e.target.value); setCalculado(false); }}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-lg font-bold focus:outline-none focus:border-blue-500/50 transition"
              placeholder="12000"
              min="0"
            />
          </div>
          <p className="text-slate-500 text-xs mt-2">Incluye limpieza, seguro, mantenimiento, electricidad y fondo de reserva.</p>
        </div>

        {/* Viviendas */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-5">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-bold text-white">Viviendas y coeficientes de participación</label>
            <button
              onClick={addVivienda}
              className="text-xs bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 font-semibold px-3 py-1.5 rounded-lg transition"
            >
              + Añadir
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="grid grid-cols-12 gap-2 text-xs text-slate-500 px-1 mb-1">
              <div className="col-span-6">Nombre / Identificación</div>
              <div className="col-span-4">Coeficiente (%)</div>
              <div className="col-span-2"></div>
            </div>
            {viviendas.map((v) => (
              <div key={v.id} className="grid grid-cols-12 gap-2 items-center">
                <input
                  type="text"
                  value={v.nombre}
                  onChange={e => updateVivienda(v.id, 'nombre', e.target.value)}
                  className="col-span-6 bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/40 transition"
                />
                <input
                  type="number"
                  value={v.coeficiente}
                  onChange={e => updateVivienda(v.id, 'coeficiente', e.target.value)}
                  className="col-span-4 bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/40 transition"
                  step="0.1"
                  min="0"
                />
                <button
                  onClick={() => removeVivienda(v.id)}
                  className="col-span-2 text-slate-600 hover:text-red-400 transition text-center text-lg leading-none"
                  disabled={viviendas.length <= 2}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className={`flex items-center justify-between text-sm px-1 ${Math.abs(totalCoef - 100) > 0.1 && totalCoef > 0 ? 'text-yellow-400' : 'text-slate-400'}`}>
            <span>Total coeficientes: <strong>{fmt(totalCoef)}%</strong></span>
            {Math.abs(totalCoef - 100) > 0.1 && totalCoef > 0 && (
              <span className="text-xs">⚠️ Debería sumar 100%</span>
            )}
          </div>
        </div>

        {/* Botón calcular */}
        <button
          onClick={handleCalcular}
          disabled={totalCoef <= 0 || gasto <= 0}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-lg transition mb-6"
        >
          Calcular cuotas →
        </button>

        {/* Resultados */}
        {calculado && (
          <div className="bg-white/3 border border-emerald-500/20 rounded-2xl overflow-hidden">
            <div className="bg-emerald-500/10 px-6 py-4 border-b border-white/8 flex items-center justify-between">
              <h2 className="font-bold text-white">Resultado — Cuotas calculadas</h2>
              <span className="text-emerald-400 text-sm font-semibold">Gasto total: €{fmt(gasto)}/año</span>
            </div>

            <div className="divide-y divide-white/5">
              {/* Header */}
              <div className="grid grid-cols-4 px-6 py-2 text-xs text-slate-500 font-semibold">
                <div className="col-span-2">Vivienda</div>
                <div className="text-right">Cuota anual</div>
                <div className="text-right">Cuota mensual</div>
              </div>
              {viviendas.map((v) => {
                const anual = calcularCuota(v.coeficiente);
                const mensual = anual / 12;
                return (
                  <div key={v.id} className="grid grid-cols-4 px-6 py-3 hover:bg-white/2 transition">
                    <div className="col-span-2">
                      <div className="text-white text-sm font-medium">{v.nombre}</div>
                      <div className="text-slate-500 text-xs">Coef. {v.coeficiente}%</div>
                    </div>
                    <div className="text-right text-white font-bold text-sm self-center">€{fmt(anual)}</div>
                    <div className="text-right text-emerald-400 font-bold text-sm self-center">€{fmt(mensual)}</div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white/3 px-6 py-4 border-t border-white/8 grid grid-cols-4">
              <div className="col-span-2 text-slate-400 text-sm font-semibold">Total comunidad</div>
              <div className="text-right text-white font-black">€{fmt(gasto)}/año</div>
              <div className="text-right text-emerald-400 font-black">€{fmt(gasto / 12)}/mes</div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/8 rounded-2xl p-8">
          <h3 className="text-lg font-black mb-2">¿Quieres que esto se haga solo cada mes?</h3>
          <p className="text-slate-400 text-sm mb-5">
            FincaHub calcula y cobra las cuotas automáticamente mediante domiciliación SEPA. Sin Excel, sin errores.
          </p>
          <Link
            href="/register"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-3 rounded-xl transition"
          >
            Probar gratis 30 días →
          </Link>
        </div>
      </section>
    </div>
  );
}
