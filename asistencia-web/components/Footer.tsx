import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-white text-lg">asistencia.io</span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed mb-6">
              La inteligencia artificial que entiende a tus clientes. Chatbots, agentes de voz y
              automatización para PYMEs españolas.
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@asistencia.io" className="hover:text-white transition-colors">
                  info@asistencia.io
                </a>
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+34613040895" className="hover:text-white transition-colors">
                  +34 613 04 08 95
                </a>
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Granada, España
              </p>
            </div>
          </div>

          {/* Soluciones */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Soluciones</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/soluciones/chatbot-empresas" className="hover:text-white transition-colors">Chatbot Web y WhatsApp</Link></li>
              <li><Link href="/soluciones/agente-de-voz" className="hover:text-white transition-colors">Agente de Voz IA</Link></li>
              <li><Link href="/soluciones/automatizacion-procesos" className="hover:text-white transition-colors">Automatización de Procesos</Link></li>
              <li><Link href="/precios" className="hover:text-white transition-colors">Precios</Link></li>
              <li><Link href="/calculadora" className="hover:text-white transition-colors">Calculadora de ROI</Link></li>
            </ul>
          </div>

          {/* Sectores */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Sectores</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/sectores/abogados" className="hover:text-white transition-colors">Despachos de Abogados</Link></li>
              <li><Link href="/sectores/clinicas-dentales" className="hover:text-white transition-colors">Clínicas Dentales</Link></li>
              <li><Link href="/sectores/inmobiliarias" className="hover:text-white transition-colors">Inmobiliarias</Link></li>
              <li><Link href="/sectores/restaurantes" className="hover:text-white transition-colors">Restaurantes</Link></li>
              <li><Link href="/sectores/servicios-profesionales" className="hover:text-white transition-colors">Servicios Profesionales</Link></li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/casos-de-exito" className="hover:text-white transition-colors">Casos de Éxito</Link></li>
              <li><Link href="/blog/guia-ia-pymes" className="hover:text-white transition-colors">Guía IA para PYMEs</Link></li>
              <li><Link href="/blog/chatbot-vs-agente-voz" className="hover:text-white transition-colors">Chatbot vs Agente de Voz</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} asistencia.io — Jorge Fernández Águila. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6 text-xs">
            <Link href="/privacy" className="hover:text-white transition-colors">Política de Privacidad</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Términos de Uso</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Política de Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
