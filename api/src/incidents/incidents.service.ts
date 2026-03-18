import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class IncidentsService {
    constructor(
        private prisma: PrismaService,
        private mailService: MailService,
        private notificationsService: NotificationsService,
    ) { }

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
        const incident = await this.prisma.incident.create({
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

        // Notify admins/presidents: email + in-app (fire & forget)
        this.notifyAdmins(communityId, reportedById, {
            title,
            description,
            reportedBy: incident.reportedBy.name,
        }).catch(() => null);

        return incident;
    }

    private async notifyAdmins(communityId: string, reportedById: string, incident: { title: string; description: string; reportedBy: string }) {
        const community = await this.prisma.community.findUnique({
            where: { id: communityId },
            include: {
                users: {
                    where: { role: { in: ['ADMIN', 'PRESIDENT'] } },
                    select: { id: true, email: true },
                },
            },
        });

        if (!community) return;

        const adminEmails = community.users.map(u => u.email);
        await this.mailService.sendIncidentAlert(adminEmails, {
            ...incident,
            communityName: community.name,
        });

        // In-app notifications for admins (excluding the reporter)
        for (const user of community.users) {
            if (user.id !== reportedById) {
                await this.notificationsService.create(user.id, {
                    type: 'INCIDENT',
                    title: 'Nueva incidencia',
                    message: `${incident.reportedBy} ha reportado: "${incident.title}"`,
                    link: '/dashboard/incidents',
                });
            }
        }
    }

    async updateIncidentStatus(incidentId: string, status: string) {
        return this.prisma.incident.update({
            where: { id: incidentId },
            data: { status },
        });
    }

    async findById(id: string) {
        return this.prisma.incident.findUnique({ where: { id } });
    }

    async deleteIncident(incidentId: string) {
        return this.prisma.incident.delete({
            where: { id: incidentId },
        });
    }
}
