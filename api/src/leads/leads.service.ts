import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import Anthropic from '@anthropic-ai/sdk';

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://fincahub.com';

const SYSTEM_PROMPT = `Eres el asistente virtual de FincaHub, el software de gestión para comunidades de propietarios en España. Ayudas a presidentes y administradores de fincas a resolver dudas y descubrir cómo FincaHub puede ayudarles.

SOBRE FINCAHUB:
- SaaS para gestión integral de comunidades de propietarios en España
- Trial gratuito de 30 días, sin tarjeta de crédito, sin permanencia
- Web: https://fincahub.com

PLANES Y PRECIOS:
- Plan Básico: 14,99€/mes — hasta 20 propiedades. Contabilidad, incidencias, anuncios, portal vecino
- Plan Profesional: 29,99€/mes — hasta 100 propiedades. Todo lo anterior + votaciones, reservas de espacios, juntas/actas, remesas SEPA
- Plan Urbanización: 59,99€/mes — propiedades ilimitadas. Todo + soporte prioritario y backups diarios

FUNCIONALIDADES PRINCIPALES:
- Contabilidad transparente: ingresos, gastos, presupuesto anual, liquidaciones por coeficiente
- Remesas SEPA ISO 20022: cobro domiciliado automático a todos los vecinos
- Incidencias con fotos y seguimiento de estado
- Votaciones digitales con plazos y múltiples opciones
- Reservas de espacios comunes (piscina, pádel, salón de actos...)
- Tablón de anuncios para la comunidad
- Juntas y actas digitales
- Análisis IA de facturas: extrae datos automáticamente y crea transacciones
- Notificaciones por email a vecinos
- Panel de administración con estadísticas en tiempo real

INSTRUCCIONES DE COMPORTAMIENTO:
- Responde siempre en español, tono amigable y cercano, directo y conciso (2-4 frases)
- Si preguntan sobre gestión de comunidades, da información útil y práctica
- Si muestran interés o preguntan por precio/funcionalidades, invítales a registrarse gratis
- Si el usuario da su email, agradécelo y dile que le enviarás información (menciona "email capturado")
- Nunca digas que eres Claude ni una IA de Anthropic. Eres el asistente de FincaHub
- No inventes funcionalidades que no estén listadas arriba
- Si no sabes algo específico de su comunidad, oriéntales a registrarse y probarlo gratis`;

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);
  private readonly anthropic = process.env.ANTHROPIC_API_KEY
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : null;

  constructor(private readonly mailerService: MailerService) {}

  async chat(message: string, history: Array<{ role: 'user' | 'assistant'; content: string }>) {
    // Auto-detect email in message and save lead
    const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      this.create(emailMatch[0]).catch(() => {});
    }

    if (!this.anthropic) {
      return '¡Hola! Soy el asistente de FincaHub. Puedo ayudarte con dudas sobre gestión de comunidades de propietarios. ¿En qué puedo ayudarte? También puedes registrarte gratis en fincahub.com y probar el software 30 días sin compromiso.';
    }

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [
          ...history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
          { role: 'user', content: message },
        ],
      });
      return (response.content[0] as { type: string; text: string }).text;
    } catch (err) {
      this.logger.error(`[Chat] Error calling Claude: ${err.message}`);
      return 'Lo siento, ahora mismo no puedo responder. Puedes contactarnos en info@fincahub.com o registrarte directamente en fincahub.com/register para el trial gratuito.';
    }
  }

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
