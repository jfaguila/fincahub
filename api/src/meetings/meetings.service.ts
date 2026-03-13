import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MeetingsService {
    constructor(private prisma: PrismaService) { }

    async getMeetings(communityId: string) {
        return this.prisma.meeting.findMany({
            where: { communityId },
            include: {
                createdBy: { select: { id: true, name: true } },
            },
            orderBy: { date: 'desc' },
        });
    }

    async createMeeting(
        communityId: string,
        createdById: string,
        title: string,
        date: Date,
        location: string,
        agenda: string,
        type: string,
    ) {
        return this.prisma.meeting.create({
            data: { communityId, createdById, title, date, location, agenda, type },
            include: {
                createdBy: { select: { id: true, name: true } },
            },
        });
    }

    async updateMinutes(id: string, minutes: string) {
        return this.prisma.meeting.update({
            where: { id },
            data: { minutes, status: 'COMPLETED' },
        });
    }

    async deleteMeeting(id: string) {
        return this.prisma.meeting.delete({ where: { id } });
    }
}
