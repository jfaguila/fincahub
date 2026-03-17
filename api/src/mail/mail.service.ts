import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(private mailerService: MailerService) { }

    private isConfigured(): boolean {
        return !!(process.env.MAIL_USER && process.env.MAIL_PASS);
    }

    async sendWelcome(email: string, name: string, communityName: string) {
        if (!this.isConfigured()) {
            this.logger.warn(`[Mail] No configurado. Bienvenida a ${name} <${email}> no enviada.`);
            return;
        }
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: `Bienvenido a ${communityName} - FincaHub`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">Bienvenido a FincaHub</h2>
                        <p>Hola <strong>${name}</strong>,</p>
                        <p>Has sido añadido como vecino en la comunidad <strong>${communityName}</strong>.</p>
                        <p>Tus credenciales de acceso:</p>
                        <ul>
                            <li><strong>Email:</strong> ${email}</li>
                            <li><strong>Contraseña temporal:</strong> password123</li>
                        </ul>
                        <p style="color: #dc2626;">Por favor, cambia tu contraseña al iniciar sesión.</p>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login"
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

    async sendPasswordReset(email: string, name: string, token: string) {
        if (!this.isConfigured()) {
            this.logger.warn(`[Mail] No configurado. Reset contraseña para ${email} no enviado. Token: ${token}`);
            return;
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
        } catch (err) {
            this.logger.error(`[Mail] Error enviando reset a ${email}:`, err.message);
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
