import { Controller, Post, Body, UseGuards, Request, Get, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BillingService } from './billing.service';
import { MailService } from '../mail/mail.service';

const PLAN_IDS: Record<string, string> = {
    basic: process.env.PAYPAL_PLAN_BASIC || '',
    professional: process.env.PAYPAL_PLAN_PROFESSIONAL || '',
    urbanization: process.env.PAYPAL_PLAN_URBANIZATION || '',
};

const PLAN_NAMES: Record<string, string> = {
    basic: 'Básico',
    professional: 'Profesional',
    urbanization: 'Urbanización',
};

const PAYPAL_BASE = process.env.PAYPAL_MODE === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

// Cache token to avoid fetching a new one on every request (tokens are valid ~9 hours)
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getPaypalAccessToken(): Promise<string> {
    if (cachedToken && Date.now() < tokenExpiresAt) {
        return cachedToken;
    }

    const credentials = Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    const data = await res.json() as any;
    cachedToken = data.access_token;
    // Expire 5 minutes early to be safe
    tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000;
    return cachedToken!;
}

@Controller('billing')
export class BillingController {

    constructor(
        private billingService: BillingService,
        private mailService: MailService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('checkout')
    async createCheckout(@Body() body: { plan: string }, @Request() req: any) {
        if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
            return {
                url: null,
                message: 'PayPal no configurado. Añade PAYPAL_CLIENT_ID y PAYPAL_CLIENT_SECRET en las variables de entorno.',
                demo: true,
            };
        }

        const planId = PLAN_IDS[body.plan] || PLAN_IDS.basic;
        if (!planId) {
            return {
                url: null,
                message: 'Plan de PayPal no configurado. Añade PAYPAL_PLAN_BASIC/PROFESSIONAL/URBANIZATION.',
                demo: true,
            };
        }

        try {
            const accessToken = await getPaypalAccessToken();
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

            const res = await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'PayPal-Request-Id': `${req.user.userId}-${Date.now()}`,
                },
                body: JSON.stringify({
                    plan_id: planId,
                    subscriber: { email_address: req.user.email },
                    application_context: {
                        brand_name: 'FincaHub',
                        locale: 'es-ES',
                        return_url: `${frontendUrl}/dashboard?plan=activated`,
                        cancel_url: `${frontendUrl}/#pricing`,
                        user_action: 'SUBSCRIBE_NOW',
                    },
                    custom_id: `${req.user.userId}:${body.plan}`,
                }),
            });

            const data = await res.json() as any;
            const approveLink = data.links?.find((l: any) => l.rel === 'approve');

            if (!approveLink) {
                return { url: null, message: `Error de PayPal: ${JSON.stringify(data)}`, demo: true };
            }

            return { url: approveLink.href };
        } catch (err: any) {
            return { url: null, message: `Error de PayPal: ${err.message}`, demo: true };
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('plans')
    getPlans() {
        return [
            { id: 'basic', name: 'Básico', price: 14.99, maxUnits: 30, description: 'Hasta 30 unidades' },
            { id: 'professional', name: 'Profesional', price: 29.99, maxUnits: 100, description: 'Hasta 100 unidades' },
            { id: 'urbanization', name: 'Urbanización', price: 59.99, maxUnits: null, description: 'Ilimitado' },
        ];
    }

    @UseGuards(JwtAuthGuard)
    @Get('status')
    async getStatus(@Request() req: any) {
        const community = await this.billingService.findCommunityByUser(req.user.userId);
        if (!community) return { subscriptionStatus: 'trial', subscriptionPlan: null };
        return this.billingService.getSubscriptionStatus(community.id);
    }

    // PayPal webhook — no JWT guard, uses signature verification
    @Post('webhook')
    async handleWebhook(
        @Headers() headers: Record<string, string>,
        @Req() req: RawBodyRequest<Request>,
    ) {
        if (!process.env.PAYPAL_CLIENT_ID) {
            return { received: true, demo: true };
        }

        const rawBody = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);
        const event = JSON.parse(rawBody);

        // Verify webhook signature with PayPal
        if (process.env.PAYPAL_WEBHOOK_ID) {
            try {
                const accessToken = await getPaypalAccessToken();
                const verifyRes = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        auth_algo: headers['paypal-auth-algo'],
                        cert_url: headers['paypal-cert-url'],
                        transmission_id: headers['paypal-transmission-id'],
                        transmission_sig: headers['paypal-transmission-sig'],
                        transmission_time: headers['paypal-transmission-time'],
                        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
                        webhook_event: event,
                    }),
                });

                const verifyData = await verifyRes.json() as any;
                if (verifyData.verification_status !== 'SUCCESS') {
                    return { error: 'Webhook signature verification failed' };
                }
            } catch {
                return { error: 'Webhook verification error' };
            }
        }

        const resource = event.resource;

        switch (event.event_type) {
            case 'BILLING.SUBSCRIPTION.ACTIVATED': {
                const community = await this.billingService.handleSubscriptionActivated(resource);
                if (community) {
                    const [, plan] = (resource.custom_id || ':').split(':');
                    const adminEmails = community.users.map((u: any) => u.email);
                    const adminName = community.users[0]?.name || 'Administrador';
                    const planName = PLAN_NAMES[plan] || 'Básico';
                    for (const email of adminEmails) {
                        await this.mailService.sendSubscriptionConfirmation(email, adminName, planName).catch(() => null);
                    }
                }
                break;
            }

            case 'BILLING.SUBSCRIPTION.UPDATED':
                await this.billingService.handleSubscriptionUpdated(resource);
                break;

            case 'BILLING.SUBSCRIPTION.CANCELLED':
            case 'BILLING.SUBSCRIPTION.SUSPENDED':
                await this.billingService.handleSubscriptionCancelled(resource);
                break;

            case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
            case 'PAYMENT.SALE.DENIED': {
                const failedCommunity = await this.billingService.findCommunityBySubscription(resource.id || resource.billing_agreement_id);
                if (failedCommunity) {
                    const adminUsers = failedCommunity.users.filter((u: any) =>
                        ['ADMIN', 'PRESIDENT'].includes(u.role)
                    );
                    for (const user of adminUsers) {
                        await this.mailService.sendPaymentFailed(user.email, user.name).catch(() => null);
                    }
                }
                break;
            }
        }

        return { received: true };
    }
}
