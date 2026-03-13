import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Stripe price IDs — set these in env after creating products in Stripe dashboard
const PRICE_IDS: Record<string, string> = {
    basic: process.env.STRIPE_PRICE_BASIC || 'price_basic_placeholder',
    professional: process.env.STRIPE_PRICE_PROFESSIONAL || 'price_professional_placeholder',
    urbanization: process.env.STRIPE_PRICE_URBANIZATION || 'price_urbanization_placeholder',
};

@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {

    @Post('checkout')
    async createCheckout(@Body() body: { plan: string }, @Request() req: any) {
        // Stripe is disabled until STRIPE_SECRET_KEY is configured
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('sk_placeholder')) {
            return {
                url: null,
                message: 'Stripe not configured. Set STRIPE_SECRET_KEY in environment variables.',
                demo: true,
            };
        }

        // Dynamic import to avoid crash when stripe is not installed
        try {
            const Stripe = (await import('stripe')).default;
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-01-27.acacia' });

            const session = await stripe.checkout.sessions.create({
                mode: 'subscription',
                payment_method_types: ['card'],
                line_items: [{ price: PRICE_IDS[body.plan] || PRICE_IDS.basic, quantity: 1 }],
                trial_period_days: 30,
                success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?plan=activated`,
                cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/#pricing`,
                customer_email: req.user.email,
                metadata: { userId: req.user.userId, plan: body.plan },
            });

            return { url: session.url };
        } catch (err) {
            return { url: null, message: 'Stripe error', demo: true };
        }
    }

    @Get('plans')
    getPlans() {
        return [
            { id: 'basic', name: 'Básico', price: 14.99, maxUnits: 30 },
            { id: 'professional', name: 'Profesional', price: 29.99, maxUnits: 100 },
            { id: 'urbanization', name: 'Urbanización', price: 59.99, maxUnits: null },
        ];
    }
}
