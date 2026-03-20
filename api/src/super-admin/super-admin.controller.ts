import { Controller, Get, Patch, Param, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('super-admin')
@UseGuards(JwtAuthGuard)
export class SuperAdminController {
    constructor(private prisma: PrismaService) {}

    private assertSuperAdmin(req: any) {
        if (req.user.role !== 'ADMIN') {
            throw new ForbiddenException('Solo el super-admin puede acceder a esto');
        }
    }

    @Get('stats')
    async getStats(@Request() req: any) {
        this.assertSuperAdmin(req);

        const [total, active, trial, canceled, pastDue, totalUsers] = await Promise.all([
            this.prisma.community.count(),
            this.prisma.community.count({ where: { subscriptionStatus: 'active' } }),
            this.prisma.community.count({ where: { subscriptionStatus: 'trial' } }),
            this.prisma.community.count({ where: { subscriptionStatus: 'canceled' } }),
            this.prisma.community.count({ where: { subscriptionStatus: 'past_due' } }),
            this.prisma.user.count(),
        ]);

        // Rough MRR estimate based on active plans
        const activeCommunities = await this.prisma.community.findMany({
            where: { subscriptionStatus: 'active' },
            select: { subscriptionPlan: true },
        });

        const planPrices: Record<string, number> = {
            basic: 29,
            professional: 59,
            urbanization: 99,
        };

        const mrr = activeCommunities.reduce((sum, c) => {
            return sum + (planPrices[c.subscriptionPlan || ''] || 0);
        }, 0);

        return { total, active, trial, canceled, pastDue, totalUsers, mrr };
    }

    @Get('communities')
    async getCommunities(@Request() req: any) {
        this.assertSuperAdmin(req);

        const communities = await this.prisma.community.findMany({
            include: {
                _count: {
                    select: { users: true, incidents: true, accounts: true, documents: true },
                },
                users: {
                    where: { role: { in: ['PRESIDENT', 'ADMIN'] } },
                    select: { email: true, name: true, role: true },
                    take: 1,
                },
                incidents: {
                    where: { status: { in: ['OPEN', 'IN_PROGRESS'] } },
                    select: { id: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return communities.map(c => {
            const president = c.users[0] || null;
            const openIncidents = c.incidents.length;

            // Health score: green = active users + accounts; yellow = partial; red = empty
            const hasUsers = c._count.users > 1;
            const hasAccounts = c._count.accounts > 0;
            const hasDocs = c._count.documents > 0;
            const health = hasUsers && hasAccounts ? 'green'
                : hasUsers || hasAccounts || hasDocs ? 'yellow'
                : 'red';

            return {
                id: c.id,
                name: c.name,
                city: c.city,
                province: c.province,
                subscriptionStatus: c.subscriptionStatus,
                subscriptionPlan: c.subscriptionPlan,
                trialEndsAt: c.trialEndsAt,
                subscriptionEndsAt: c.subscriptionEndsAt,
                createdAt: c.createdAt,
                userCount: c._count.users,
                openIncidents,
                health,
                presidentEmail: president?.email || null,
                presidentName: president?.name || null,
            };
        });
    }

    @Patch('communities/:id/status')
    async updateStatus(
        @Request() req: any,
        @Param('id') id: string,
        @Body() body: { status: string },
    ) {
        this.assertSuperAdmin(req);

        const allowed = ['active', 'trial', 'canceled', 'past_due'];
        if (!allowed.includes(body.status)) {
            throw new ForbiddenException('Estado no válido');
        }

        const updated = await this.prisma.community.update({
            where: { id },
            data: { subscriptionStatus: body.status },
            select: { id: true, name: true, subscriptionStatus: true },
        });

        return updated;
    }
}
