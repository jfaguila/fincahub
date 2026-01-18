import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IncidentsService {
    constructor(private prisma: PrismaService) { }

    async getIncidents(communityId: string, status?: string) {
        return this.prisma.incident.findMany({
            where: {
                communityId,
                ...(status && { status }),
            },
            include: {
                reportedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async createIncident(communityId: string, reportedById: string, title: string, description: string, photos?: string[]) {
        return this.prisma.incident.create({
            data: {
                communityId,
                reportedById,
                title,
                description,
                photos: photos ? JSON.stringify(photos) : null,
            },
            include: {
                reportedBy: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async updateIncidentStatus(incidentId: string, status: string) {
        return this.prisma.incident.update({
            where: { id: incidentId },
            data: { status },
        });
    }

    async deleteIncident(incidentId: string) {
        return this.prisma.incident.delete({
            where: { id: incidentId },
        });
    }
}
