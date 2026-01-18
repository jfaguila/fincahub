import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
    constructor(private prisma: PrismaService) { }

    async getDocuments(communityId: string, category?: string) {
        return this.prisma.document.findMany({
            where: {
                communityId,
                ...(category && { category }),
            },
            include: {
                uploadedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { uploadedAt: 'desc' },
        });
    }

    async uploadDocument(
        communityId: string,
        uploadedById: string,
        name: string,
        url: string,
        category: string,
    ) {
        return this.prisma.document.create({
            data: {
                communityId,
                uploadedById,
                name,
                url,
                category,
            },
            include: {
                uploadedBy: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }

    async deleteDocument(documentId: string) {
        return this.prisma.document.delete({
            where: { id: documentId },
        });
    }
}
