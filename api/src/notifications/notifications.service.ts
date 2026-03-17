import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, data: {
        type: string;
        title: string;
        message: string;
        link?: string;
    }) {
        return this.prisma.notification.create({
            data: { ...data, userId },
        });
    }

    async createForCommunity(communityId: string, data: {
        type: string;
        title: string;
        message: string;
        link?: string;
    }, excludeUserId?: string) {
        const users = await this.prisma.user.findMany({
            where: {
                communityId,
                ...(excludeUserId ? { id: { not: excludeUserId } } : {}),
            },
            select: { id: true },
        });

        if (users.length === 0) return;

        await this.prisma.notification.createMany({
            data: users.map(u => ({ ...data, userId: u.id })),
        });
    }

    async findForUser(userId: string) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }

    async markRead(notificationId: string, userId: string) {
        return this.prisma.notification.updateMany({
            where: { id: notificationId, userId },
            data: { read: true },
        });
    }

    async markAllRead(userId: string) {
        return this.prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });
    }

    async countUnread(userId: string) {
        return this.prisma.notification.count({
            where: { userId, read: false },
        });
    }
}
