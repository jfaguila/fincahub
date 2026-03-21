import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const EXEMPT_PREFIXES = ['/auth', '/billing', '/health', '/super-admin'];

@Injectable()
export class SubscriptionGuard implements CanActivate {
    constructor(private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Not authenticated yet — let JwtAuthGuard handle it
        if (!user) return true;

        // ADMIN sees everything (no community bound)
        if (user.role === 'ADMIN') return true;

        // Billing and auth routes are always accessible so expired users can pay
        const url: string = request.url || '';
        if (EXEMPT_PREFIXES.some((p) => url.startsWith(p))) return true;

        // No community → nothing to check
        if (!user.communityId) return true;

        const community = await this.prisma.community.findUnique({
            where: { id: user.communityId },
            select: { subscriptionStatus: true },
        });

        if (community?.subscriptionStatus === 'expired') {
            throw new ForbiddenException({
                error: 'SUBSCRIPTION_EXPIRED',
                message: 'Tu período de prueba ha expirado. Activa un plan para continuar.',
            });
        }

        return true;
    }
}
