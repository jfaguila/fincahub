import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-8">
          404
        </div>
        <h1 className="text-4xl font-bold mb-4">Pagina no encontrada</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Lo sentimos, la pagina que buscas no existe o ha sido movida. Comprueba la URL o vuelve a la pagina principal.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-0.5"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
