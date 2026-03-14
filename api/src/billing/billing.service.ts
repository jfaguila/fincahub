import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
    private readonly logger = new Logger(BillingService.name);

    constructor(private prisma: PrismaService) { }

    async updateSubscription(communityId: string, data: {
        stripeCustomerId?: string;
        stripeSubscriptionId?: string;
        subscriptionStatus: string;
        subscriptionPlan?: string;
        subscriptionEndsAt?: Date | null;
    }) {
        return this.prisma.community.update({
            where: { id: communityId },
            data,
        });
    }

    async findCommunityByStripeCustomer(stripeCustomerId: string) {
        return this.prisma.community.findFirst({
            where: { stripeCustomerId },
            include: {
                users: {
                    where: { role: 'ADMIN' },
                    select: { email: true, name: true },
                },
            },
        });
    }

    async findCommunityByUser(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                community: {
                    include: {
                        users: {
                            where: { role: 'ADMIN' },
                            select: { email: true, name: true },
                        },
                    },
                },
            },
        });
        return user?.community || null;
    }

    async handleCheckoutCompleted(session: any) {
        const { userId, plan } = session.metadata || {};
        if (!userId) return;

        const community = await this.findCommunityByUser(userId);
        if (!community) return;

        await this.updateSubscription(community.id, {
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            subscriptionStatus: 'active',
            subscriptionPlan: plan || 'basic',
        });

        this.logger.log(`[Billing] Suscripción activada para comunidad ${community.id}, plan: ${plan}`);
        return community;
    }

    async handleSubscriptionUpdated(subscription: any) {
        const community = await this.findCommunityByStripeCustomer(subscription.customer);
        if (!community) return;

        const endsAt = subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : null;

        await this.updateSubscription(community.id, {
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            subscriptionEndsAt: endsAt,
        });

        this.logger.log(`[Billing] Suscripción actualizada para comunidad ${community.id}: ${subscription.status}`);
        return community;
    }

    async handleSubscriptionDeleted(subscription: any) {
        const community = await this.findCommunityByStripeCustomer(subscription.customer);
        if (!community) return;

        await this.updateSubscription(community.id, {
            subscriptionStatus: 'canceled',
            subscriptionEndsAt: new Date(),
        });

        this.logger.log(`[Billing] Suscripción cancelada para comunidad ${community.id}`);
        return community;
    }

    async getSubscriptionStatus(communityId: string) {
        return this.prisma.community.findUnique({
            where: { id: communityId },
            select: {
                subscriptionStatus: true,
                subscriptionPlan: true,
                subscriptionEndsAt: true,
            },
        });
    }
}
