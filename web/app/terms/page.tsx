import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">F</div>
            <span className="text-xl font-bold tracking-tight">Fincahub</span>
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">Terminos y Condiciones de Uso</h1>
        <p className="text-gray-400 mb-12">Ultima actualizacion: 16 de marzo de 2026</p>

        <div className="space-y-10 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Objeto del servicio</h2>
            <p>
              FincaHub S.L. (en adelante, &ldquo;FincaHub&rdquo;) ofrece una plataforma de gestion integral para
              comunidades de propietarios, que incluye herramientas de contabilidad, gestion de incidencias,
              votaciones online, reservas de espacios comunes, comunicacion entre vecinos y administracion documental.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Registro y cuenta</h2>
            <p>
              Para acceder al servicio es necesario crear una cuenta proporcionando datos veridicos y actualizados.
              El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso.
              FincaHub se reserva el derecho de suspender o cancelar cuentas que incumplan estos terminos
              o que muestren un uso fraudulento de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Planes y precios</h2>
            <p>
              FincaHub ofrece distintos planes de suscripcion con diferentes funcionalidades y limites.
              Los precios vigentes se publican en la pagina web y pueden ser actualizados con un preaviso
              minimo de 30 dias. Los cambios de plan se aplican de forma inmediata y se prorratean en el
              periodo de facturacion correspondiente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Periodo de prueba</h2>
            <p>
              Todos los planes incluyen un periodo de prueba gratuito de <strong className="text-white">30 dias</strong>.
              Durante este periodo, el usuario tendra acceso completo a las funcionalidades del plan seleccionado.
              No se requiere tarjeta de credito para iniciar la prueba. Al finalizar el periodo, el usuario
              podra suscribirse a un plan de pago o su cuenta sera limitada.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Cancelacion</h2>
            <p>
              El usuario puede cancelar su suscripcion en cualquier momento desde su panel de control.
              No existen contratos de permanencia ni penalizaciones por cancelacion anticipada.
              La cancelacion sera efectiva al final del periodo de facturacion vigente, manteniendo
              el acceso al servicio hasta dicha fecha. Una vez cancelada, los datos se conservaran
              durante 30 dias antes de su eliminacion definitiva.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Propiedad intelectual</h2>
            <p>
              Todos los derechos de propiedad intelectual sobre la plataforma, incluyendo el software,
              diseno, logotipos, marcas y contenido, pertenecen a FincaHub S.L. El usuario no podra
              copiar, modificar, distribuir ni realizar ingenieria inversa de ningun componente de la
              plataforma. Los datos introducidos por el usuario seguiran siendo propiedad del mismo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Limitacion de responsabilidad</h2>
            <p>
              FincaHub se compromete a ofrecer un servicio de alta disponibilidad, pero no garantiza
              un funcionamiento ininterrumpido. FincaHub no sera responsable de danos indirectos,
              incidentales o consecuentes derivados del uso o imposibilidad de uso de la plataforma.
              La responsabilidad maxima de FincaHub se limitara al importe abonado por el usuario
              en los 12 meses anteriores al evento que origine la reclamacion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Modificaciones</h2>
            <p>
              FincaHub se reserva el derecho de modificar estos terminos en cualquier momento.
              Las modificaciones se comunicaran a los usuarios con un preaviso minimo de 15 dias
              a traves de la plataforma o por correo electronico. El uso continuado del servicio
              tras la entrada en vigor de las modificaciones implicara la aceptacion de los nuevos terminos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Ley aplicable y jurisdiccion</h2>
            <p>
              Estos terminos se rigen por la legislacion espanola. Para la resolucion de cualquier
              controversia derivada del uso del servicio, las partes se someten a los juzgados y
              tribunales de la ciudad de Madrid, Espana, con renuncia expresa a cualquier otro fuero
              que pudiera corresponderles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Contacto</h2>
            <p>
              Para cualquier consulta relacionada con estos terminos, puede escribirnos a{' '}
              <a href="mailto:legal@fincahub.es" className="text-blue-400 hover:underline">legal@fincahub.es</a>.
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-white/10 bg-black/40 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-gray-500">
          <span>&copy; 2026 FincaHub S.L. Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  );
}
