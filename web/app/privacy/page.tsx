import Link from 'next/link';

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold mb-2">Politica de Privacidad</h1>
        <p className="text-gray-400 mb-12">Ultima actualizacion: 16 de marzo de 2026</p>

        <div className="space-y-10 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Responsable del tratamiento</h2>
            <p>
              El responsable del tratamiento de sus datos personales es <strong className="text-white">FincaHub S.L.</strong>,
              con domicilio social en Madrid, Espana. Puede contactarnos en{' '}
              <a href="mailto:privacidad@fincahub.es" className="text-blue-400 hover:underline">privacidad@fincahub.es</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Datos que recopilamos</h2>
            <p className="mb-3">Recopilamos los siguientes datos personales:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Nombre y apellidos</li>
              <li>Direccion de correo electronico</li>
              <li>Datos relativos a la comunidad de propietarios (direccion, numero de vivienda, rol)</li>
              <li>Datos de facturacion y pago</li>
              <li>Direccion IP y datos de navegacion</li>
              <li>Datos generados por el uso de la plataforma (incidencias, votaciones, reservas)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Finalidad del tratamiento</h2>
            <p className="mb-3">Sus datos se utilizan para:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Gestionar su cuenta de usuario y prestar el servicio contratado</li>
              <li>Procesar pagos y facturacion</li>
              <li>Enviar comunicaciones relacionadas con el servicio</li>
              <li>Mejorar la plataforma y la experiencia de usuario</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Base legal del tratamiento</h2>
            <p>
              El tratamiento de sus datos se fundamenta en el Reglamento General de Proteccion de Datos (RGPD)
              y la Ley Organica 3/2018 de Proteccion de Datos Personales y Garantia de los Derechos Digitales (LOPDGDD).
              Las bases legales aplicables son: la ejecucion del contrato, el consentimiento del usuario, el interes
              legitimo del responsable y el cumplimiento de obligaciones legales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Conservacion de datos</h2>
            <p>
              Sus datos personales se conservaran mientras mantenga una cuenta activa en la plataforma.
              Una vez cancelada la cuenta, los datos se conservaran bloqueados durante el plazo legalmente
              establecido para atender posibles responsabilidades, y posteriormente seran eliminados de forma segura.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Derechos ARCO</h2>
            <p className="mb-3">
              Usted tiene derecho a ejercer los siguientes derechos en cualquier momento:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong className="text-white">Acceso:</strong> Conocer que datos personales tratamos sobre usted.</li>
              <li><strong className="text-white">Rectificacion:</strong> Corregir datos inexactos o incompletos.</li>
              <li><strong className="text-white">Cancelacion/Supresion:</strong> Solicitar la eliminacion de sus datos.</li>
              <li><strong className="text-white">Oposicion:</strong> Oponerse al tratamiento de sus datos en determinadas circunstancias.</li>
              <li><strong className="text-white">Portabilidad:</strong> Recibir sus datos en un formato estructurado y legible.</li>
              <li><strong className="text-white">Limitacion:</strong> Solicitar la limitacion del tratamiento de sus datos.</li>
            </ul>
            <p className="mt-3">
              Para ejercer estos derechos, envie un correo a{' '}
              <a href="mailto:privacidad@fincahub.es" className="text-blue-400 hover:underline">privacidad@fincahub.es</a>{' '}
              indicando su nombre completo y el derecho que desea ejercer. Tambien puede presentar una reclamacion
              ante la Agencia Espanola de Proteccion de Datos (AEPD).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Cookies</h2>
            <p>
              Utilizamos cookies propias y de terceros para mejorar la experiencia de navegacion, analizar
              el trafico y personalizar el contenido. Puede configurar sus preferencias de cookies en el
              banner que aparece al visitar nuestra web. Para mas informacion, consulte nuestra politica de cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Seguridad</h2>
            <p>
              Implementamos medidas tecnicas y organizativas adecuadas para proteger sus datos personales,
              incluyendo cifrado SSL/TLS, servidores ubicados en la Union Europea y copias de seguridad diarias.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Contacto</h2>
            <p>
              Para cualquier consulta relacionada con esta politica de privacidad, puede escribirnos a{' '}
              <a href="mailto:privacidad@fincahub.es" className="text-blue-400 hover:underline">privacidad@fincahub.es</a>.
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
