import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AnnouncementsService {
    constructor(
        private prisma: PrismaService,
        private mailService: MailService,
        private notificationsService: NotificationsService,
    ) { }

    async getAnnouncements(communityId: string) {
        return this.prisma.announcement.findMany({
            where: { communityId },
            include: {
                author: { select: { id: true, name: true, role: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async createAnnouncement(communityId: string, authorId: string, title: string, content: string, pinned: boolean = false) {
        const announcement = await this.prisma.announcement.create({
            data: { communityId, authorId, title, content, pinned },
            include: {
                author: { select: { id: true, name: true, role: true } },
            },
        });

        // Notify all community members: email + in-app (fire & forget)
        this.notifyNeighbors(communityId, authorId, title, content).catch(() => null);

        return announcement;
    }

    private async notifyNeighbors(communityId: string, authorId: string, title: string, content: string) {
        const community = await this.prisma.community.findUnique({
            where: { id: communityId },
            include: {
                users: { select: { id: true, email: true } },
            },
        });

        if (!community) return;

        const emails = community.users.map(u => u.email);
        await this.mailService.sendAnnouncement(emails, title, content, community.name);

        // In-app notifications for all neighbors except the author
        for (const user of community.users) {
            if (user.id !== authorId) {
                await this.notificationsService.create(user.id, {
                    type: 'ANNOUNCEMENT',
                    title: 'Nuevo aviso en el tablón',
                    message: title,
                    link: '/dashboard/announcements',
                });
            }
        }
    }

    async deleteAnnouncement(id: string) {
        return this.prisma.announcement.delete({ where: { id } });
    }

    async togglePin(id: string) {
        const ann = await this.prisma.announcement.findUnique({ where: { id } });
        return this.prisma.announcement.update({
            where: { id },
            data: { pinned: !ann?.pinned },
        });
    }
}
