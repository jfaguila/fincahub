import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { MailService } from './mail/mail.service';
import { BackupService } from './backup/backup.service';

@Controller()
export class AppController {
    constructor(
        private mailService: MailService,
        private backupService: BackupService,
    ) { }

    @Get()
    getHello(): any {
        return {
            message: 'Fincahub API v1.0',
            status: 'running',
            docs: '/health para ver el estado de todos los servicios',
        };
    }

    @Get('health')
    healthCheck(): any {
        const paypalOk = !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
        const emailOk = !!(process.env.MAIL_USER && process.env.MAIL_PASS);
        const dbOk = !!process.env.DATABASE_URL;
        const jwtOk = !!process.env.JWT_SECRET;
        const frontendOk = !!process.env.FRONTEND_URL;

        const paypalPlansOk = !!(
            process.env.PAYPAL_PLAN_BASIC &&
            process.env.PAYPAL_PLAN_PROFESSIONAL &&
            process.env.PAYPAL_PLAN_URBANIZATION
        );

        const allOk = paypalOk && emailOk && dbOk && jwtOk && frontendOk && paypalPlansOk;

        return {
            status: allOk ? 'ok' : 'partial',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            services: {
                database: {
                    ok: dbOk,
                    message: dbOk ? 'DATABASE_URL configurada' : '❌ Falta DATABASE_URL',
                },
                jwt: {
                    ok: jwtOk,
                    message: jwtOk ? 'JWT_SECRET configurado' : '❌ Falta JWT_SECRET',
                },
                frontend: {
                    ok: frontendOk,
                    url: process.env.FRONTEND_URL || null,
                    message: frontendOk ? `FRONTEND_URL: ${process.env.FRONTEND_URL}` : '❌ Falta FRONTEND_URL',
                },
                paypal: {
                    ok: paypalOk,
                    mode: process.env.PAYPAL_MODE || 'sandbox',
                    plansConfigured: paypalPlansOk,
                    message: paypalOk
                        ? `PayPal ${process.env.PAYPAL_MODE || 'sandbox'} configurado${paypalPlansOk ? ' con planes' : ' — faltan IDs de planes'}`
                        : '❌ Falta PAYPAL_CLIENT_ID o PAYPAL_CLIENT_SECRET',
                },
                email: {
                    ok: emailOk,
                    host: process.env.MAIL_HOST || null,
                    user: process.env.MAIL_USER ? `${process.env.MAIL_USER.slice(0, 3)}***` : null,
                    message: emailOk
                        ? `Email configurado: ${process.env.MAIL_HOST} (${process.env.MAIL_USER?.slice(0, 3)}***)`
                        : '❌ Falta MAIL_USER o MAIL_PASS — los emails no se enviarán',
                },
                backups: {
                    ok: dbOk,
                    dir: process.env.BACKUP_DIR || '/tmp/fincahub-backups',
                    s3: this.backupService.isS3Configured(),
                    recent: this.backupService.listBackups().slice(0, 3),
                    message: dbOk
                        ? `Backup diario a las 03:00 UTC${this.backupService.isS3Configured() ? ' → S3 configurado' : ' — solo local (configura AWS_S3_BUCKET para S3)'}`
                        : '❌ Sin DB, sin backups',
                },
            },
            nextSteps: [
                !emailOk && 'Configura MAIL_USER y MAIL_PASS para activar emails',
                !paypalPlansOk && 'Configura PAYPAL_PLAN_BASIC/PROFESSIONAL/URBANIZATION',
                !frontendOk && 'Configura FRONTEND_URL con la URL de tu frontend',
            ].filter(Boolean),
        };
    }

    // Send test email — only for admins/presidents
    @Post('admin/test-email')
    @UseGuards(JwtAuthGuard)
    async sendTestEmail(@Request() req: any, @Body() body: { to?: string }) {
        if (!['ADMIN', 'PRESIDENT'].includes(req.user.role)) {
            return { ok: false, message: 'No autorizado' };
        }

        const target = body.to || req.user.email;
        try {
            const sent = await this.mailService.sendPasswordReset(target, 'Admin', 'test-token-12345');
            if (sent === false) {
                return {
                    ok: false,
                    message: 'Email no configurado. Añade MAIL_USER y MAIL_PASS en Railway.',
                };
            }
            return {
                ok: true,
                message: `Email de prueba enviado a ${target}. Revisa tu bandeja.`,
            };
        } catch (err: any) {
            return {
                ok: false,
                message: `Error al enviar: ${err.message}. Verifica MAIL_USER y MAIL_PASS en Railway.`,
            };
        }
    }

    // Trigger manual backup — only for admins/presidents
    @Post('admin/backup')
    @UseGuards(JwtAuthGuard)
    async triggerBackup(@Request() req: any) {
        if (!['ADMIN', 'PRESIDENT'].includes(req.user.role)) {
            return { ok: false, message: 'No autorizado' };
        }

        const path = await this.backupService.createBackup();
        if (path) {
            return { ok: true, message: `Backup creado: ${path}` };
        }
        return { ok: false, message: 'Error creando backup. Verifica que pg_dump esté disponible.' };
    }
}
