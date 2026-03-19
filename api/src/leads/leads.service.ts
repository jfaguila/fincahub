import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://fincahub.com';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(private readonly mailerService: MailerService) {}

  async create(email: string) {
    this.logger.log(`[Lead] Nuevo lead capturado: ${email}`);
    await this.sendLeadMagnet(email);
  }

  private async sendLeadMagnet(email: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Tu guía del Presidente de Comunidad 2026 — FincaHub',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #fff; padding: 40px 32px; border-radius: 16px;">
            <div style="text-align:center; margin-bottom: 32px;">
              <div style="display:inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 10px 20px; border-radius: 12px;">
                <span style="font-size: 22px; font-weight: 900; color: #fff; letter-spacing: -0.5px;">FincaHub</span>
              </div>
            </div>

            <h1 style="font-size: 26px; font-weight: 900; color: #fff; margin-bottom: 8px;">
              Tu Guía del Presidente de Comunidad 2026
            </h1>
            <p style="color: #94a3b8; font-size: 15px; line-height: 1.6;">
              Gracias por tu interés. Aquí tienes todo lo que necesitas saber para gestionar tu comunidad sin dramas este año.
            </p>

            <div style="background: #1e293b; border-radius: 12px; padding: 24px; margin: 24px 0;">
              <h2 style="color: #60a5fa; font-size: 16px; margin-bottom: 16px;">📋 Lo que cubre esta guía:</h2>
              <ul style="color: #cbd5e1; font-size: 14px; line-height: 2; padding-left: 20px; margin: 0;">
                <li><strong style="color:#fff">Contabilidad</strong>: cómo cuadrar cuentas y hacer el presupuesto anual</li>
                <li><strong style="color:#fff">Morosos</strong>: el proceso legal paso a paso para cobrar deudas</li>
                <li><strong style="color:#fff">Juntas</strong>: convocatoria, quórum y acta correcta según la LPH</li>
                <li><strong style="color:#fff">Derramas</strong>: cuándo son legales y cómo calcularlas</li>
                <li><strong style="color:#fff">Votaciones</strong>: qué mayorías se necesitan para cada acuerdo</li>
                <li><strong style="color:#fff">Herramientas</strong>: software que te ahorra 10h/mes de trabajo</li>
              </ul>
            </div>

            <div style="background: linear-gradient(135deg, #1d4ed8, #7c3aed); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
              <p style="color: #bfdbfe; font-size: 14px; margin: 0 0 8px;">Gestiona tu comunidad de forma profesional</p>
              <h3 style="color: #fff; font-size: 20px; font-weight: 900; margin: 0 0 16px;">Prueba FincaHub gratis 30 días</h3>
              <a href="${FRONTEND_URL}/register" style="display: inline-block; background: #fff; color: #1d4ed8; font-weight: 700; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 15px;">
                Empezar gratis →
              </a>
              <p style="color: #93c5fd; font-size: 12px; margin: 12px 0 0;">Sin tarjeta · Sin permanencia</p>
            </div>

            <h2 style="color: #fff; font-size: 18px; font-weight: 900; margin-top: 32px;">Los 10 puntos clave del presidente</h2>

            ${[
              ['Lleva la contabilidad al día', 'Un libro de ingresos y gastos actualizado mensualmente te ahorra problemas al final del año y evita conflictos con los vecinos.'],
              ['Aproba el presupuesto en la junta ordinaria', 'Es obligatorio por ley. Sin presupuesto aprobado no puedes reclamar cuotas judicialmente.'],
              ['Mantén el fondo de reserva al 10%', 'La LPH exige mantener al menos el 10% del presupuesto ordinario como fondo de reserva para imprevistos.'],
              ['Envía las convocatorias con 6 días de antelación', 'Para juntas ordinarias, el mínimo legal es de 6 días naturales. Guarda siempre prueba del envío.'],
              ['Documenta todas las incidencias', 'Mantén un registro con fecha, descripción y fotos. Es esencial si el problema acaba en disputa legal.'],
              ['Actúa rápido con los morosos', 'Cuanto más tarde, más difícil es cobrar. Empieza con una carta amistosa y escala si no hay respuesta.'],
              ['Aprueba las obras en junta', 'Toda obra que supere 3 meses de cuotas ordinarias necesita aprobación de la junta. Sin esto no tiene validez.'],
              ['Guarda todas las actas', 'Las actas deben conservarse indefinidamente. Son el historial legal de la comunidad.'],
              ['Notifica las derramas correctamente', 'Cada propietario debe recibir notificación escrita con el importe y la fecha de pago.'],
              ['Digitaliza tu gestión', 'Un buen software te ahorra horas de trabajo y aumenta la transparencia. Los vecinos están más satisfechos cuando ven las cuentas en tiempo real.'],
            ].map(([title, desc], i) => `
              <div style="display: flex; gap: 16px; margin-bottom: 16px; background: #1e293b; border-radius: 10px; padding: 16px;">
                <span style="font-size: 24px; font-weight: 900; color: #374151; flex-shrink: 0;">${String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p style="color: #fff; font-weight: 700; margin: 0 0 4px; font-size: 14px;">${title}</p>
                  <p style="color: #94a3b8; font-size: 13px; margin: 0; line-height: 1.5;">${desc}</p>
                </div>
              </div>
            `).join('')}

            <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #1e293b;">
              <p style="color: #4b5563; font-size: 12px;">
                FincaHub S.L. · <a href="https://fincahub.com" style="color: #60a5fa;">fincahub.com</a><br>
                Si no quieres recibir más emails, <a href="${FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #60a5fa;">cancela aquí</a>
              </p>
            </div>
          </div>
        `,
      });
      this.logger.log(`[Lead] Guía enviada a ${email}`);
    } catch (err) {
      this.logger.error(`[Lead] Error enviando guía a ${email}: ${err.message}`);
    }
  }
}
