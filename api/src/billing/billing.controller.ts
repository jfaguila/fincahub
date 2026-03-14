import { Controller, Post, Body, UseGuards, Request, Get, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BillingService } from './billing.service';
import { MailService } from '../mail/mail.service';

// Stripe price IDs — set these in env after creating products in Stripe dashboard
const PRICE_IDS: Record<string, string> = {
    basic: process.env.STRIPE_PRICE_BASIC || 'price_basic_placeholder',
    professional: process.env.STRIPE_PRICE_PROFESSIONAL || 'price_professional_placeholder',
    urbanization: process.env.STRIPE_PRICE_URBANIZATION || 'price_urbanization_placeholder',
};

const PLAN_NAMES: Record<string, string> = {
    basic: 'Básico',
    professional: 'Profesional',
    urbanization: 'Urbanización',
};

@Controller('billing')
export class BillingController {

    constructor(
        private billingService: BillingService,
        private mailService: MailService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('checkout')
    async createCheckout(@Body() body: { plan: string }, @Request() req: any) {
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('sk_placeholder')) {
            return {
                url: null,
                message: 'Stripe no configurado. Añade STRIPE_SECRET_KEY en las variables de entorno.',
                demo: true,
            };
        }

        try {
            const Stripe = (await import('stripe')).default;
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' });

            const session = await stripe.checkout.sessions.create({
                mode: 'subscription',
                payment_method_types: ['card'],
                line_items: [{ price: PRICE_IDS[body.plan] || PRICE_IDS.basic, quantity: 1 }],
                subscription_data: { trial_period_days: 30 },
                success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?plan=activated`,
                cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/#pricing`,
                customer_email: req.user.email,
                metadata: { userId: req.user.userId, plan: body.plan },
            });

            return { url: session.url };
        } catch (err) {
            return { url: null, message: `Error de Stripe: ${err.message}`, demo: true };
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
        const communityId = req.user.communityId;
        if (!communityId) return { subscriptionStatus: 'trial', subscriptionPlan: null };
        return this.billingService.getSubscriptionStatus(communityId);
    }

    // Stripe webhook — no JWT guard, uses signature verification
    @Post('webhook')
    async handleWebhook(
        @Headers('stripe-signature') signature: string,
        @Req() req: RawBodyRequest<Request>,
    ) {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('sk_placeholder')) {
            return { received: true, demo: true };
        }

        let event: any;

        try {
            const Stripe = (await import('stripe')).default;
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' });

            if (webhookSecret && signature && req.rawBody) {
                event = stripe.webhooks.constructEvent(req.rawBody, signature, webhookSecret);
            } else {
                // Dev mode: parse body directly
                event = req.body as any;
            }
        } catch (err) {
            return { error: `Webhook signature verification failed: ${err.message}` };
        }

        switch (event.type) {
            case 'checkout.session.completed': {
                const community = await this.billingService.handleCheckoutCompleted(event.data.object);
                if (community) {
                    const adminEmails = community.users.map((u: any) => u.email);
                    const adminName = community.users[0]?.name || 'Administrador';
                    const planName = PLAN_NAMES[event.data.object.metadata?.plan] || 'Básico';
                    for (const email of adminEmails) {
                        await this.mailService.sendSubscriptionConfirmation(email, adminName, planName);
                    }
                }
                break;
            }

            case 'customer.subscription.updated':
                await this.billingService.handleSubscriptionUpdated(event.data.object);
                break;

            case 'customer.subscription.deleted':
                await this.billingService.handleSubscriptionDeleted(event.data.object);
                break;
        }

        return { received: true };
    }
}
