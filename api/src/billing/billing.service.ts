import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
    private readonly logger = new Logger(BillingService.name);

    constructor(private prisma: PrismaService) { }

    async updateSubscription(communityId: string, data: {
        paypalSubscriberId?: string;
        paypalSubscriptionId?: string;
        subscriptionStatus: string;
        subscriptionPlan?: string;
        subscriptionEndsAt?: Date | null;
    }) {
        return this.prisma.community.update({
            where: { id: communityId },
            data,
        });
    }

    async findCommunityByPaypalSubscription(paypalSubscriptionId: string) {
        return this.prisma.community.findFirst({
            where: { paypalSubscriptionId },
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

    async handleSubscriptionActivated(resource: any) {
        const [userId, plan] = (resource.custom_id || ':').split(':');
        if (!userId) return;

        const community = await this.findCommunityByUser(userId);
        if (!community) return;

        await this.updateSubscription(community.id, {
            paypalSubscriberId: resource.subscriber?.payer_id,
            paypalSubscriptionId: resource.id,
            subscriptionStatus: 'active',
            subscriptionPlan: plan || 'basic',
        });

        this.logger.log(`[Billing] Suscripción PayPal activada para comunidad ${community.id}, plan: ${plan}`);
        return community;
    }

    async handleSubscriptionUpdated(resource: any) {
        const community = await this.findCommunityByPaypalSubscription(resource.id);
        if (!community) return;

        const endsAt = resource.billing_info?.next_billing_time
            ? new Date(resource.billing_info.next_billing_time)
            : null;

        const status = resource.status?.toLowerCase();
        await this.updateSubscription(community.id, {
            subscriptionStatus: status === 'active' ? 'active' : status,
            subscriptionEndsAt: endsAt,
        });

        this.logger.log(`[Billing] Suscripción PayPal actualizada para comunidad ${community.id}: ${resource.status}`);
        return community;
    }

    async handleSubscriptionCancelled(resource: any) {
        const community = await this.findCommunityByPaypalSubscription(resource.id);
        if (!community) return;

        await this.updateSubscription(community.id, {
            subscriptionStatus: 'canceled',
            subscriptionEndsAt: new Date(),
        });

        this.logger.log(`[Billing] Suscripción PayPal cancelada para comunidad ${community.id}`);
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
