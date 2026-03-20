import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(private mailerService: MailerService) { }

    private isConfigured(): boolean {
        return !!(process.env.MAIL_USER && process.env.MAIL_PASS);
    }

    async sendWelcome(email: string, name: string, communityName: string, temporaryPassword?: string) {
        if (!this.isConfigured()) {
            this.logger.warn(`[Mail] No configurado. Bienvenida a ${name} <${email}> no enviada.`);
            return;
        }
        try {
            const passwordSection = temporaryPassword
                ? `<p>Tu contraseña temporal: <strong style="font-size:18px; letter-spacing:2px;">${temporaryPassword}</strong></p>
                   <p style="color:#6b7280; font-size:13px;">Cambia tu contraseña tras el primer acceso desde tu perfil.</p>`
                : `<p>Usa el enlace de recuperación de contraseña en la pantalla de inicio de sesión para establecer tu contraseña.</p>`;

            await this.mailerService.sendMail({
                to: email,
                subject: `Bienvenido a ${communityName} - FincaHub`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">Bienvenido a FincaHub</h2>
                        <p>Hola <strong>${name}</strong>,</p>
                        <p>Has sido añadido como vecino en la comunidad <strong>${communityName}</strong>.</p>
                        <p>Tu email de acceso: <strong>${email}</strong></p>
                        ${passwordSection}
                        <a href="${process.env.FRONTEND_URL || 'https://fincahub.com'}/login"
                           style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px;">
                            Iniciar Sesión
                        </a>
                    </div>
                `,
            });
            this.logger.log(`[Mail] Bienvenida enviada a ${email}`);
        } catch (err) {
            this.logger.error(`[Mail] Error enviando bienvenida a ${email}:`, err.message);
        }
    }

    async sendIncidentAlert(adminEmails: string[], incident: { title: string; description: string; reportedBy: string; communityName: string }) {
        if (!this.isConfigured() || adminEmails.length === 0) return;
        try {
            await this.mailerService.sendMail({
                to: adminEmails,
                subject: `[FincaHub] Nueva incidencia: ${incident.title}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #dc2626;">Nueva Incidencia Reportada</h2>
                        <p><strong>Comunidad:</strong> ${incident.communityName}</p>
                        <p><strong>Título:</strong> ${incident.title}</p>
                        <p><strong>Descripción:</strong> ${incident.description}</p>
                        <p><strong>Reportada por:</strong> ${incident.reportedBy}</p>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/incidents"
                           style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px;">
                            Ver Incidencia
                        </a>
                    </div>
                `,
            });
            this.logger.log(`[Mail] Alerta de incidencia enviada a ${adminEmails.length} admin(s)`);
        } catch (err) {
            this.logger.error('[Mail] Error enviando alerta de incidencia:', err.message);
        }
    }

    async sendAnnouncement(emails: string[], title: string, content: string, communityName: string) {
        if (!this.isConfigured() || emails.length === 0) return;
        try {
            await this.mailerService.sendMail({
                to: emails,
                subject: `[${communityName}] ${title}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">${title}</h2>
                        <p style="color: #666;">Aviso de la comunidad ${communityName}</p>
                        <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0;">
                            ${content}
                        </div>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/announcements"
                           style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px;">
                            Ver en FincaHub
                        </a>
                    </div>
                `,
            });
            this.logger.log(`[Mail] Aviso enviado a ${emails.length} vecino(s)`);
        } catch (err) {
            this.logger.error('[Mail] Error enviando aviso:', err.message);
        }
    }

    async sendEmailVerification(email: string, name: string, token: string) {
        if (!this.isConfigured()) {
            this.logger.warn(`[Mail] No configurado. Verificación de email para ${email} no enviada.`);
            return;
        }
        const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'Verifica tu email - FincaHub',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #fff; padding: 32px; border-radius: 12px;">
                        <div style="text-align:center; margin-bottom:24px;">
                            <span style="font-size:22px;font-weight:900;background:linear-gradient(135deg,#60a5fa,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">FincaHub</span>
                        </div>
                        <h2 style="color: #3b82f6; text-align:center;">Confirma tu email</h2>
                        <p style="color: #9ca3af;">Hola <strong style="color: #fff;">${name}</strong>,</p>
                        <p style="color: #9ca3af;">Gracias por registrarte en FincaHub. Haz clic en el botón para confirmar tu dirección de email y activar tu cuenta:</p>
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="${verifyUrl}" style="background: linear-gradient(135deg,#2563eb,#7c3aed); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size:16px;">
                                Verificar mi email →
                            </a>
                        </div>
                        <p style="color: #6b7280; font-size: 13px; text-align:center;">Este enlace caduca en 24 horas. Si no te has registrado en FincaHub, ignora este email.</p>
                    </div>
                `,
            });
            this.logger.log(`[Mail] Verificación de email enviada a ${email}`);
        } catch (err) {
            this.logger.error(`[Mail] Error enviando verificación a ${email}:`, err.message);
        }
    }

    async sendPasswordReset(email: string, name: string, token: string): Promise<boolean> {
        if (!this.isConfigured()) {
            this.logger.warn(`[Mail] No configurado. Reset contraseña para ${email} no enviado.`);
            return false;
        }
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'Recuperar contraseña - FincaHub',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #fff; padding: 32px; border-radius: 12px;">
                        <h2 style="color: #3b82f6;">Recuperar contraseña</h2>
                        <p style="color: #9ca3af;">Hola <strong style="color: #fff;">${name}</strong>,</p>
                        <p style="color: #9ca3af;">Hemos recibido una solicitud para restablecer tu contraseña. Haz clic para crear una nueva:</p>
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                Restablecer contraseña
                            </a>
                        </div>
                        <p style="color: #6b7280; font-size: 13px;">Este enlace caduca en 1 hora. Si no has solicitado el cambio, ignora este email.</p>
                    </div>
                `,
            });
            this.logger.log(`[Mail] Reset de contraseña enviado a ${email}`);
            return true;
        } catch (err) {
            this.logger.error(`[Mail] Error enviando reset a ${email}:`, err.message);
            throw err;
        }
    }

    // ─── ONBOARDING TRIAL SEQUENCE ────────────────────────────────────────────

    private emailHtml(title: string, body: string, ctaText: string, ctaUrl: string): string {
        const base = process.env.FRONTEND_URL || 'https://fincahub.com';
        return `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0f;color:#fff;border-radius:16px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#1e1b4b,#0f172a);padding:32px 40px;text-align:center;">
            <span style="font-size:22px;font-weight:900;background:linear-gradient(135deg,#60a5fa,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">FincaHub</span>
          </div>
          <div style="padding:32px 40px;">
            <h2 style="color:#fff;font-size:20px;margin-bottom:16px;">${title}</h2>
            <div style="color:#9ca3af;font-size:15px;line-height:1.7;">${body}</div>
            <div style="text-align:center;margin:32px 0;">
              <a href="${base}${ctaUrl}" style="background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;padding:14px 32px;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;display:inline-block;">
                ${ctaText} →
              </a>
            </div>
          </div>
          <div style="padding:16px 40px 24px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
            <p style="color:#4b5563;font-size:12px;margin:0;">FincaHub · Gestión de comunidades de vecinos · <a href="${base}/privacy" style="color:#6b7280;">Privacidad</a></p>
          </div>
        </div>`;
    }

    async sendTrialWelcome(email: string, name: string) {
        if (!this.isConfigured()) return;
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: `Bienvenido a FincaHub, ${name} — tu prueba de 30 días empieza ahora`,
                html: this.emailHtml(
                    `Hola ${name}, bienvenido 👋`,
                    `Tu comunidad está a punto de gestionarse sola.<br><br>
                    En los próximos días te iremos mostrando todo lo que puedes hacer. Empieza por lo más sencillo: <strong style="color:#fff;">añadir tus vecinos</strong> para tener el directorio completo.<br><br>
                    Tienes <strong style="color:#60a5fa;">30 días completamente gratis</strong>, sin tarjeta ni compromisos.`,
                    'Acceder ahora', '/dashboard'
                ),
            });
            this.logger.log(`[Mail][Trial] Bienvenida enviada a ${email}`);
        } catch (err) {
            this.logger.error(`[Mail][Trial] Error bienvenida ${email}:`, err.message);
        }
    }

    async sendTrialDay4Features(email: string, name: string) {
        if (!this.isConfigured()) return;
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: `${name}, ¿sabías que puedes votar desde el móvil? 🗳️`,
                html: this.emailHtml(
                    'La función que ningún competidor tiene',
                    `Las votaciones online en juntas de propietarios son <strong style="color:#fff;">100% legales en España</strong> desde 2021 (RDL 8/2021).<br><br>
                    Con FincaHub puedes:<br>
                    <ul style="color:#9ca3af;padding-left:20px;margin:12px 0;">
                        <li style="margin-bottom:8px;">Crear votaciones en 30 segundos</li>
                        <li style="margin-bottom:8px;">Delegar voto digitalmente</li>
                        <li style="margin-bottom:8px;">Obtener el acta certificada automáticamente</li>
                    </ul>
                    Sin reuniones interminables. Sin que nadie diga que no llegó la convocatoria.`,
                    'Crear mi primera votación', '/dashboard/voting'
                ),
            });
            this.logger.log(`[Mail][Trial] Día 4 enviado a ${email}`);
        } catch (err) {
            this.logger.error(`[Mail][Trial] Error día 4 ${email}:`, err.message);
        }
    }

    async sendTrialDay7Accounting(email: string, name: string) {
        if (!this.isConfigured()) return;
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: `${name}, tu primer informe de cuentas está listo 📊`,
                html: this.emailHtml(
                    'Cuentas transparentes, vecinos tranquilos',
                    `¿Has visto el módulo de contabilidad? Lleva la cuenta de cada euro que entra y sale de tu comunidad.<br><br>
                    Con FincaHub puedes detectar <strong style="color:#fff;">morosos automáticamente</strong>, generar remesas SEPA y presentar la liquidación anual con un clic.<br><br>
                    El tiempo medio que ahorran nuestros presidentes: <strong style="color:#60a5fa;">4 horas al mes</strong>.`,
                    'Ver mis cuentas', '/dashboard/accounts'
                ),
            });
            this.logger.log(`[Mail][Trial] Día 7 enviado a ${email}`);
        } catch (err) {
            this.logger.error(`[Mail][Trial] Error día 7 ${email}:`, err.message);
        }
    }

    async sendTrialDay14Checkin(email: string, name: string) {
        if (!this.isConfigured()) return;
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: `${name}, llevas 2 semanas en FincaHub — ¿podemos ayudarte?`,
                html: this.emailHtml(
                    '¿Cómo va todo?',
                    `Llevas 2 semanas usando FincaHub. Nos alegra tenerte con nosotros.<br><br>
                    Si tienes alguna duda o algo no funciona como esperabas, <strong style="color:#fff;">responde este email directamente</strong> y te contestamos en menos de 24 horas.<br><br>
                    También puedes reservar una videollamada de 20 minutos con nuestro equipo para que te ayudemos a configurarlo todo.`,
                    'Reservar videollamada gratis', '/dashboard'
                ),
            });
            this.logger.log(`[Mail][Trial] Día 14 enviado a ${email}`);
        } catch (err) {
            this.logger.error(`[Mail][Trial] Error día 14 ${email}:`, err.message);
        }
    }

    async sendTrialDay21Urgency(email: string, name: string) {
        if (!this.isConfigured()) return;
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: `${name}, te quedan 9 días de prueba — esto dice otro presidente como tú`,
                html: this.emailHtml(
                    'Lo que dicen otros presidentes',
                    `<em style="color:#d1d5db;">"Antes tardaba horas en cuadrar las cuentas. Con FincaHub lo tengo todo en 5 minutos. Los vecinos están encantados con la transparencia."</em><br>
                    <span style="color:#6b7280;font-size:13px;">— Carlos Martínez, presidente de comunidad en Madrid</span><br><br>
                    Tu prueba termina en <strong style="color:#f59e0b;">9 días</strong>. Si decides continuar, el plan Profesional (hasta 100 viviendas) cuesta solo <strong style="color:#fff;">€29,99/mes</strong>.`,
                    'Ver planes', '/dashboard/billing'
                ),
            });
            this.logger.log(`[Mail][Trial] Día 21 enviado a ${email}`);
        } catch (err) {
            this.logger.error(`[Mail][Trial] Error día 21 ${email}:`, err.message);
        }
    }

    async sendTrialDay28Offer(email: string, name: string, discountCode = 'BIENVENIDA20') {
        if (!this.isConfigured()) return;
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: `${name}, tu prueba termina en 2 días — 20% de descuento solo hoy`,
                html: this.emailHtml(
                    '⏰ Oferta especial: 20% en tu primer mes',
                    `Tu trial gratuito termina en <strong style="color:#ef4444;">2 días</strong>.<br><br>
                    Para que no pierdas nada de lo que has configurado, te ofrecemos un <strong style="color:#10b981;">20% de descuento en tu primer mes</strong>.<br><br>
                    Usa el código <strong style="color:#60a5fa;font-size:18px;background:rgba(96,165,250,0.1);padding:4px 12px;border-radius:6px;">${discountCode}</strong> al activar tu plan.<br><br>
                    <span style="color:#6b7280;font-size:13px;">Esta oferta vence cuando expire tu trial.</span>`,
                    'Activar mi plan con descuento', '/dashboard/billing'
                ),
            });
            this.logger.log(`[Mail][Trial] Día 28 enviado a ${email}`);
        } catch (err) {
            this.logger.error(`[Mail][Trial] Error día 28 ${email}:`, err.message);
        }
    }

    async sendTrialExpired(email: string, name: string) {
        if (!this.isConfigured()) return;
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: `${name}, tu prueba de FincaHub ha terminado`,
                html: this.emailHtml(
                    'Tu prueba ha finalizado',
                    `Tu período de prueba gratuito ha terminado. Tus datos están seguros, no hemos borrado nada.<br><br>
                    Para seguir usando FincaHub y mantener acceso a todo lo que has configurado, activa cualquier plan desde €14,99/mes.<br><br>
                    Sin tarjeta hasta hoy. Sin permanencia nunca.`,
                    'Reactivar mi cuenta', '/dashboard/billing'
                ),
            });
            this.logger.log(`[Mail][Trial] Expiración enviada a ${email}`);
        } catch (err) {
            this.logger.error(`[Mail][Trial] Error expiración ${email}:`, err.message);
        }
    }

    async sendTrialExitSurvey(email: string, name: string) {
        if (!this.isConfigured()) return;
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: `${name}, ¿qué podríamos haber hecho mejor?`,
                html: this.emailHtml(
                    'Nos importa tu opinión',
                    `Vemos que tu prueba terminó sin activar un plan. Está bien, lo entendemos.<br><br>
                    ¿Nos dices por qué? Con tu respuesta mejoramos el producto para los siguientes presidentes.<br><br>
                    Solo una pregunta: <strong style="color:#fff;">¿qué te faltó para quedarte?</strong><br><br>
                    Responde directamente a este email. Prometemos leer cada respuesta.`,
                    'Reactivar igualmente', '/dashboard/billing'
                ),
            });
            this.logger.log(`[Mail][Trial] Encuesta salida enviada a ${email}`);
        } catch (err) {
            this.logger.error(`[Mail][Trial] Error encuesta salida ${email}:`, err.message);
        }
    }

    // ─── /ONBOARDING TRIAL SEQUENCE ───────────────────────────────────────────

    async sendPaymentFailed(email: string, name: string) {
        if (!this.isConfigured()) return;
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'Problema con tu pago - FincaHub',
                html: this.emailHtml(
                    'No hemos podido procesar tu pago',
                    `Hola <strong style="color:#fff;">${name}</strong>,<br><br>
                    Hemos intentado cobrar tu suscripción a FincaHub pero el pago no se ha podido procesar.<br><br>
                    Por favor, actualiza tu método de pago en PayPal para evitar interrupciones en el servicio.<br><br>
                    <span style="color:#6b7280;font-size:13px;">Si crees que es un error, contacta con tu banco o con nosotros respondiendo este email.</span>`,
                    'Actualizar método de pago', '/dashboard/billing'
                ),
            });
            this.logger.log(`[Mail] Pago fallido notificado a ${email}`);
        } catch (err) {
            this.logger.error(`[Mail] Error notificando pago fallido a ${email}:`, err.message);
        }
    }

    /** Día 3 — Tip de contabilidad */
    async sendTrialDay3(email: string, name: string) {
        if (!this.isConfigured()) return;
        const url = process.env.FRONTEND_URL || 'https://fincahub.com';
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: `${name}, ¿ya tienes las cuentas de tu comunidad en FincaHub?`,
                html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0f;color:#fff;padding:40px 32px;border-radius:16px;">
                  <h1 style="font-size:22px;font-weight:900;color:#fff;">El módulo más valorado: la contabilidad</h1>
                  <p style="color:#94a3b8;font-size:15px;line-height:1.6;">El 78% de los presidentes de comunidad dicen que la contabilidad les quita más tiempo. Con FincaHub, esto cambia.</p>
                  <div style="background:#1e293b;border-radius:12px;padding:20px;margin:20px 0;">
                    <p style="color:#fff;font-weight:700;margin:0 0 12px;">En menos de 5 minutos puedes:</p>
                    <ul style="color:#cbd5e1;font-size:14px;line-height:2;padding-left:20px;margin:0;">
                      <li>Registrar ingresos y gastos con categorías</li>
                      <li>Ver el balance en tiempo real</li>
                      <li>Generar remesa SEPA para cobrar cuotas automáticamente</li>
                      <li>Detectar morosos con un vistazo</li>
                    </ul>
                  </div>
                  <a href="${url}/dashboard/accounts" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:15px;">Probar la contabilidad →</a>
                  <p style="color:#4b5563;font-size:12px;margin-top:32px;">FincaHub · <a href="${url}/blog/cuentas-comunidad-vecinos" style="color:#60a5fa;">Lee nuestra guía de contabilidad →</a></p>
                </div>`,
            });
        } catch (err) {
            this.logger.error(`[Mail] Error trial día 3 ${email}: ${err.message}`);
        }
    }

    /** Día 7 — Votaciones y juntas */
    async sendTrialDay7(email: string, name: string) {
        if (!this.isConfigured()) return;
        const url = process.env.FRONTEND_URL || 'https://fincahub.com';
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: `¿Sabías que puedes hacer juntas de vecinos online con FincaHub?`,
                html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0f;color:#fff;padding:40px 32px;border-radius:16px;">
                  <h1 style="font-size:22px;font-weight:900;color:#fff;">Sin reuniones presenciales interminables</h1>
                  <p style="color:#94a3b8;font-size:15px;line-height:1.6;">Las votaciones online de FincaHub son 100% legales según la LPH reformada. Los vecinos votan desde el móvil en segundos.</p>
                  <div style="background:#1e293b;border-radius:12px;padding:20px;margin:20px 0;">
                    <p style="color:#a78bfa;font-weight:700;margin:0 0 8px;">¿Cómo funciona?</p>
                    <p style="color:#cbd5e1;font-size:14px;line-height:1.6;margin:0;">1. Crea la votación con las opciones → 2. Los vecinos reciben email y votan → 3. El resultado se registra automáticamente en el acta</p>
                  </div>
                  <a href="${url}/dashboard/voting" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:15px;">Crear mi primera votación →</a>
                  <p style="color:#4b5563;font-size:12px;margin-top:32px;"><a href="${url}/blog/votaciones-online-comunidad" style="color:#60a5fa;">¿Son legales las votaciones online? Lee el artículo →</a></p>
                </div>`,
            });
        } catch (err) {
            this.logger.error(`[Mail] Error trial día 7 ${email}: ${err.message}`);
        }
    }

    /** Día 14 — Morosos y SEPA */
    async sendTrialDay14(email: string, name: string) {
        if (!this.isConfigured()) return;
        const url = process.env.FRONTEND_URL || 'https://fincahub.com';
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: `${name}, ¿tienes vecinos morosos? FincaHub los detecta automáticamente`,
                html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0f;color:#fff;padding:40px 32px;border-radius:16px;">
                  <h1 style="font-size:22px;font-weight:900;color:#fff;">Deja de perseguir a los morosos</h1>
                  <p style="color:#94a3b8;font-size:15px;line-height:1.6;">El 15% de los propietarios tiene algún recibo impagado. Con FincaHub, los detectas en segundos y generas la carta de reclamación en un clic.</p>
                  <div style="background:#1e293b;border-radius:12px;padding:20px;margin:20px 0;">
                    <p style="color:#f87171;font-weight:700;margin:0 0 12px;">Herramientas anti-morosidad incluidas:</p>
                    <ul style="color:#cbd5e1;font-size:14px;line-height:2;padding-left:20px;margin:0;">
                      <li>Detección automática de impagos</li>
                      <li>Carta de reclamación formal en PDF</li>
                      <li>Remesa SEPA para cobro domiciliado</li>
                      <li>Historial completo de deuda por propietario</li>
                    </ul>
                  </div>
                  <a href="${url}/dashboard/neighbors" style="display:inline-block;background:linear-gradient(135deg,#dc2626,#b45309);color:#fff;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:15px;">Ver mis vecinos →</a>
                  <p style="color:#4b5563;font-size:12px;margin-top:32px;"><a href="${url}/blog/cobrar-morosos-comunidad" style="color:#60a5fa;">Guía completa: cómo cobrar a morosos →</a></p>
                </div>`,
            });
        } catch (err) {
            this.logger.error(`[Mail] Error trial día 14 ${email}: ${err.message}`);
        }
    }

    /** Día 25 — Urgencia fin de trial */
    async sendTrialDay25(email: string, name: string) {
        if (!this.isConfigured()) return;
        const url = process.env.FRONTEND_URL || 'https://fincahub.com';
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: `⚠️ ${name}, tu prueba gratuita termina en 5 días`,
                html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0f;color:#fff;padding:40px 32px;border-radius:16px;">
                  <h1 style="font-size:22px;font-weight:900;color:#fff;">Solo te quedan 5 días de prueba gratuita</h1>
                  <p style="color:#94a3b8;font-size:15px;line-height:1.6;">No pierdas tus datos ni el acceso de tus vecinos. Continúa con FincaHub desde <strong style="color:#fff;">14,99€/mes</strong>.</p>
                  <div style="background:#1e293b;border-radius:12px;padding:20px;margin:20px 0;">
                    <p style="color:#fbbf24;font-weight:700;margin:0 0 12px;">¿Qué pierdes si no continúas?</p>
                    <ul style="color:#cbd5e1;font-size:14px;line-height:2;padding-left:20px;margin:0;">
                      <li>Acceso a tus cuentas y transacciones</li>
                      <li>El historial de incidencias</li>
                      <li>Las actas y documentos subidos</li>
                      <li>El acceso de tus vecinos al portal</li>
                    </ul>
                  </div>
                  <a href="${url}/dashboard/billing" style="display:inline-block;background:linear-gradient(135deg,#d97706,#b45309);color:#fff;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:15px;">Continuar con FincaHub →</a>
                  <p style="color:#4b5563;font-size:12px;margin-top:24px;">¿Tienes dudas? Responde a este email y te ayudamos.</p>
                </div>`,
            });
        } catch (err) {
            this.logger.error(`[Mail] Error trial día 25 ${email}: ${err.message}`);
        }
    }

    async sendSubscriptionConfirmation(email: string, name: string, plan: string) {
        if (!this.isConfigured()) return;
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'Suscripción activada - FincaHub',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #16a34a;">Suscripción Activada</h2>
                        <p>Hola <strong>${name}</strong>,</p>
                        <p>Tu suscripción al plan <strong>${plan}</strong> ha sido activada correctamente.</p>
                        <p>Gracias por confiar en FincaHub para la gestión de tu comunidad.</p>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard"
                           style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px;">
                            Ir al Dashboard
                        </a>
                    </div>
                `,
            });
        } catch (err) {
            this.logger.error('[Mail] Error enviando confirmación de suscripción:', err.message);
        }
    }
}
