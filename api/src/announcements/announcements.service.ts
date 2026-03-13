import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnnouncementsService {
    constructor(private prisma: PrismaService) { }

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
        return this.prisma.announcement.create({
            data: { communityId, authorId, title, content, pinned },
            include: {
                author: { select: { id: true, name: true, role: true } },
            },
        });
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
