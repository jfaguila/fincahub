"use client";

import { useState, useMemo } from "react";

type Sector = "abogados" | "clinica" | "inmobiliaria" | "restaurante" | "otros";

interface SectorConfig {
  label: string;
  icon: string;
  ticketMedio: number;
  horasAdmin: number;
  llamadasPerdidas: number;
  porcentajeConversion: number;
}

const SECTORES: Record<Sector, SectorConfig> = {
  abogados: {
    label: "Despacho de Abogados",
    icon: "⚖️",
    ticketMedio: 450,
    horasAdmin: 15,
    llamadasPerdidas: 25,
    porcentajeConversion: 30,
  },
  clinica: {
    label: "Clínica Dental / Médica",
    icon: "🦷",
    ticketMedio: 280,
    horasAdmin: 20,
    llamadasPerdidas: 20,
    porcentajeConversion: 40,
  },
  inmobiliaria: {
    label: "Inmobiliaria",
    icon: "🏠",
    ticketMedio: 3500,
    horasAdmin: 12,
    llamadasPerdidas: 15,
    porcentajeConversion: 20,
  },
  restaurante: {
    label: "Restaurante / Hostelería",
    icon: "🍽️",
    ticketMedio: 45,
    horasAdmin: 8,
    llamadasPerdidas: 30,
    porcentajeConversion: 80,
  },
  otros: {
    label: "Otros servicios profesionales",
    icon: "💼",
    ticketMedio: 300,
    horasAdmin: 10,
    llamadasPerdidas: 20,
    porcentajeConversion: 25,
  },
};

export default function CalculadoraROI() {
  const [sector, setSector] = useState<Sector>("abogados");
  const [llamadasSemana, setLlamadasSemana] = useState(20);
  const [ticketMedio, setTicketMedio] = useState(SECTORES.abogados.ticketMedio);
  const [horasAdmin, setHorasAdmin] = useState(SECTORES.abogados.horasAdmin);
  const [costeHora, setCosteHora] = useState(25);
  const [showResult, setShowResult] = useState(false);
  const [step, setStep] = useState(1);

  const handleSectorChange = (s: Sector) => {
    setSector(s);
    const config = SECTORES[s];
    setTicketMedio(config.ticketMedio);
    setHorasAdmin(config.horasAdmin);
    setLlamadasSemana(config.llamadasPerdidas);
  };

  const resultados = useMemo(() => {
    const config = SECTORES[sector];
    const llamadasPerdidasSemana = Math.round(llamadasSemana * 0.4); // 40% se pierden
    const clientesPerdidosMes = Math.round(
      llamadasPerdidasSemana * 4 * (config.porcentajeConversion / 100)
    );
    const ingresosPerdidosMes = clientesPerdidosMes * ticketMedio;
    const costeTiempoAdminMes = horasAdmin * 4 * costeHora;
    const totalPerdidaMes = ingresosPerdidosMes + costeTiempoAdminMes;

    const costeAsistente = 149;
    const ahorroPrimerMes = totalPerdidaMes - costeAsistente;
    const roi = Math.round((ahorroPrimerMes / costeAsistente) * 100);

    return {
      llamadasPerdidasSemana,
      llamadasPerdidasMes: llamadasPerdidasSemana * 4,
      clientesPerdidosMes,
      ingresosPerdidosMes,
      costeTiempoAdminMes,
      totalPerdidaMes,
      costeAsistente,
      ahorroPrimerMes,
      roi,
    };
  }, [sector, llamadasSemana, ticketMedio, horasAdmin, costeHora]);

  const formatEuros = (n: number) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="gradient-primary p-6 text-white text-center">
        <h2 className="text-2xl font-extrabold mb-1">Calculadora de ROI</h2>
        <p className="text-indigo-200 text-sm">
          Descubre cuánto dinero pierde tu negocio cada mes por no automatizar
        </p>
      </div>

      {/* Progress */}
      <div className="flex border-b border-gray-100">
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            onClick={() => s < step && setStep(s)}
            className={`flex-1 py-3 text-xs font-semibold transition-colors ${
              step === s
                ? "border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50"
                : step > s
                ? "text-green-600 bg-green-50"
                : "text-gray-400"
            }`}
          >
            {step > s ? "✓ " : `${s}. `}
            {s === 1 ? "Tu sector" : s === 2 ? "Tu negocio" : "Resultado"}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* STEP 1: Sector */}
        {step === 1 && (
          <div>
            <h3 className="font-bold text-gray-900 mb-4">¿En qué sector está tu negocio?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.entries(SECTORES) as [Sector, SectorConfig][]).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => handleSectorChange(key)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    sector === key
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  <span className="text-2xl">{config.icon}</span>
                  <span className={`font-medium text-sm ${sector === key ? "text-indigo-700" : "text-gray-700"}`}>
                    {config.label}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* STEP 2: Datos */}
        {step === 2 && (
          <div>
            <h3 className="font-bold text-gray-900 mb-6">Cuéntanos sobre tu negocio</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ¿Cuántas llamadas/consultas recibes a la semana?
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={5}
                    max={100}
                    value={llamadasSemana}
                    onChange={(e) => setLlamadasSemana(Number(e.target.value))}
                    className="flex-1 accent-indigo-600"
                  />
                  <span className="w-16 text-center font-bold text-indigo-600 text-lg">
                    {llamadasSemana}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Estimamos que pierdes ~{Math.round(llamadasSemana * 0.4)} por semana fuera de horario
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ticket medio por cliente (€)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={50}
                    max={5000}
                    step={50}
                    value={ticketMedio}
                    onChange={(e) => setTicketMedio(Number(e.target.value))}
                    className="flex-1 accent-indigo-600"
                  />
                  <span className="w-20 text-center font-bold text-indigo-600 text-lg">
                    {formatEuros(ticketMedio)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Horas/semana dedicadas a tareas administrativas de atención
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={1}
                    max={40}
                    value={horasAdmin}
                    onChange={(e) => setHorasAdmin(Number(e.target.value))}
                    className="flex-1 accent-indigo-600"
                  />
                  <span className="w-16 text-center font-bold text-indigo-600 text-lg">
                    {horasAdmin}h
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Coste hora de tu equipo (€/h)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={costeHora}
                    onChange={(e) => setCosteHora(Number(e.target.value))}
                    className="flex-1 accent-indigo-600"
                  />
                  <span className="w-16 text-center font-bold text-indigo-600 text-lg">
                    {costeHora}€
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                ← Atrás
              </button>
              <button
                onClick={() => { setStep(3); setShowResult(true); }}
                className="flex-2 flex-grow-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Calcular mi ROI →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Resultado */}
        {step === 3 && showResult && (
          <div>
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-1">Tu negocio está perdiendo cada mes</p>
              <div className="text-5xl font-extrabold text-red-500">
                {formatEuros(resultados.totalPerdidaMes)}
              </div>
              <p className="text-xs text-gray-400 mt-1">por no automatizar la atención al cliente</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Llamadas perdidas/mes</span>
                <span className="font-bold text-red-500">~{resultados.llamadasPerdidasMes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Clientes potenciales perdidos/mes</span>
                <span className="font-bold text-red-500">~{resultados.clientesPerdidosMes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ingresos no captados/mes</span>
                <span className="font-bold text-red-500">{formatEuros(resultados.ingresosPerdidosMes)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                <span className="text-sm text-gray-600">Coste tiempo administrativo/mes</span>
                <span className="font-bold text-red-500">{formatEuros(resultados.costeTiempoAdminMes)}</span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
              <p className="text-sm font-semibold text-green-700 mb-3">Con asistencia.io (149€/mes):</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Ahorro estimado primer mes</span>
                <span className="font-bold text-green-600">{formatEuros(resultados.ahorroPrimerMes)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-800">ROI primer mes</span>
                <span className="text-2xl font-extrabold text-green-600">
                  {resultados.roi > 0 ? `${resultados.roi}%` : "Positivo"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href="/contacto#demo"
                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl text-center transition-all hover:scale-105"
              >
                Ver cómo recuperar ese dinero → Demo gratis
              </a>
              <a
                href="https://wa.me/34613040895"
                className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl text-center transition-colors"
              >
                Hablar por WhatsApp
              </a>
              <button
                onClick={() => setStep(1)}
                className="block w-full text-gray-400 text-sm text-center py-2 hover:text-gray-600"
              >
                Recalcular
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              * Estimaciones conservadoras basadas en datos reales de clientes. Los resultados individuales pueden variar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
