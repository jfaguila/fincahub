import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

/**
 * Secuencia de onboarding para el período de trial (30 días).
 * Se ejecuta cada día a las 09:00 hora española y envía el email
 * correspondiente según los días transcurridos desde el registro.
 *
 * Día 1  → Bienvenida
 * Día 4  → Feature: votaciones online
 * Día 7  → Feature: contabilidad
 * Día 14 → Check-in + oferta de videollamada
 * Día 21 → Urgencia + testimonial
 * Día 28 → Oferta 20% descuento
 * Día 30 → Trial expirado
 * Día 31 → Encuesta de salida (solo si no ha activado plan)
 */
@Injectable()
export class OnboardingService {
    private readonly logger = new Logger(OnboardingService.name);

    constructor(
        private prisma: PrismaService,
        private mail: MailService,
    ) { }

    @Cron('0 9 * * *', { timeZone: 'Europe/Madrid' })
    async runDailyOnboardingSequence() {
        this.logger.log('[Onboarding] Iniciando secuencia diaria de onboarding...');

        const communities = await this.prisma.community.findMany({
            where: {
                subscriptionStatus: 'trial',
                trialEndsAt: { not: null },
            },
            include: {
                users: {
                    where: { role: 'ADMIN' },
                    select: { email: true, name: true },
                    take: 1,
                },
            },
        });

        let sent = 0;

        for (const community of communities) {
            const admin = community.users[0];
            if (!admin?.email) continue;

            const createdAt = community.createdAt;
            const now = new Date();
            const daysSinceCreation = Math.floor(
                (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
            );

            const trialEndsAt = community.trialEndsAt!;
            const daysUntilExpiry = Math.floor(
                (trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
            );

            const alreadyActive = community.subscriptionStatus !== 'trial';
            if (alreadyActive) continue;

            try {
                if (daysSinceCreation === 1) {
                    await this.mail.sendTrialWelcome(admin.email, admin.name);
                    sent++;
                } else if (daysSinceCreation === 4) {
                    await this.mail.sendTrialDay4Features(admin.email, admin.name);
                    sent++;
                } else if (daysSinceCreation === 7) {
                    await this.mail.sendTrialDay7Accounting(admin.email, admin.name);
                    sent++;
                } else if (daysSinceCreation === 14) {
                    await this.mail.sendTrialDay14Checkin(admin.email, admin.name);
                    sent++;
                } else if (daysSinceCreation === 21) {
                    await this.mail.sendTrialDay21Urgency(admin.email, admin.name);
                    sent++;
                } else if (daysUntilExpiry === 2) {
                    await this.mail.sendTrialDay28Offer(admin.email, admin.name);
                    sent++;
                } else if (daysUntilExpiry === 0) {
                    await this.mail.sendTrialExpired(admin.email, admin.name);
                    sent++;
                } else if (daysUntilExpiry === -1) {
                    await this.mail.sendTrialExitSurvey(admin.email, admin.name);
                    sent++;
                }
            } catch (err) {
                this.logger.error(
                    `[Onboarding] Error procesando comunidad ${community.id}: ${err.message}`,
                );
            }
        }

        this.logger.log(`[Onboarding] Secuencia completada. Emails enviados: ${sent}`);
    }
}
