"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">asistencia.io</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="relative group">
              <button className="text-gray-600 hover:text-indigo-600 text-sm font-medium flex items-center gap-1">
                Soluciones
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-2">
                  <Link href="/soluciones/chatbot-empresas" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                    Chatbot Web y WhatsApp
                  </Link>
                  <Link href="/soluciones/agente-de-voz" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                    Agente de Voz IA
                  </Link>
                  <Link href="/soluciones/automatizacion-procesos" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                    Automatización de Procesos
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative group">
              <button className="text-gray-600 hover:text-indigo-600 text-sm font-medium flex items-center gap-1">
                Sectores
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-2">
                  <Link href="/sectores/abogados" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                    Despachos de Abogados
                  </Link>
                  <Link href="/sectores/clinicas-dentales" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                    Clínicas Dentales
                  </Link>
                  <Link href="/sectores/inmobiliarias" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                    Inmobiliarias
                  </Link>
                  <Link href="/sectores/restaurantes" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                    Restaurantes
                  </Link>
                  <Link href="/sectores/servicios-profesionales" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                    Servicios Profesionales
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/casos-de-exito" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">
              Casos de Éxito
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">
              Blog
            </Link>
            <Link href="/precios" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">
              Precios
            </Link>
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/contacto"
              className="text-sm font-medium text-gray-600 hover:text-indigo-600"
            >
              Contacto
            </Link>
            <Link
              href="/contacto#demo"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Demo gratis
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-2">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Soluciones</p>
            <Link href="/soluciones/chatbot-empresas" className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-600">Chatbot Web y WhatsApp</Link>
            <Link href="/soluciones/agente-de-voz" className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-600">Agente de Voz IA</Link>
            <p className="px-3 pt-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Sectores</p>
            <Link href="/sectores/abogados" className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-600">Despachos de Abogados</Link>
            <Link href="/sectores/clinicas-dentales" className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-600">Clínicas Dentales</Link>
            <Link href="/sectores/inmobiliarias" className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-600">Inmobiliarias</Link>
            <Link href="/sectores/restaurantes" className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-600">Restaurantes</Link>
            <div className="pt-2 px-3 flex flex-col gap-2">
              <Link href="/precios" className="text-sm text-gray-700 hover:text-indigo-600">Precios</Link>
              <Link href="/blog" className="text-sm text-gray-700 hover:text-indigo-600">Blog</Link>
              <Link href="/contacto#demo" className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg text-center">
                Solicitar demo gratis
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
