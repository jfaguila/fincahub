'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-8">
          !
        </div>
        <h1 className="text-4xl font-bold mb-4">Algo salio mal</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Ha ocurrido un error inesperado. Por favor, intentalo de nuevo. Si el problema persiste,
          contacta con nuestro equipo de soporte.
        </p>
        <button
          onClick={() => reset()}
          className="inline-block px-8 py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-0.5"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
