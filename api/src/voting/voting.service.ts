import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VotingService {
    constructor(private prisma: PrismaService) { }

    async getVotes(communityId: string) {
        const votes = await this.prisma.vote.findMany({
            where: { communityId },
            include: {
                responses: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Parse options JSON and calculate results
        return votes.map((vote) => {
            const options = JSON.parse(vote.options) as string[];
            const results = options.reduce((acc: Record<string, number>, option: string) => {
                acc[option] = vote.responses.filter((r) => r.option === option).length;
                return acc;
            }, {});

            return {
                ...vote,
                options,
                results,
                totalVotes: vote.responses.length,
                isActive: new Date(vote.deadline) > new Date(),
            };
        });
    }

    async createVote(
        communityId: string,
        question: string,
        description: string,
        options: string[],
        deadline: Date,
    ) {
        return this.prisma.vote.create({
            data: {
                communityId,
                question,
                description,
                options: JSON.stringify(options),
                deadline,
            },
        });
    }

    async castVote(voteId: string, userId: string, option: string) {
        // Check if vote exists and is still active
        const vote = await this.prisma.vote.findUnique({ where: { id: voteId } });
        if (!vote) {
            throw new BadRequestException('Vote not found');
        }

        if (new Date(vote.deadline) < new Date()) {
            throw new BadRequestException('Vote has ended');
        }

        // Check if user already voted
        const existingResponse = await this.prisma.voteResponse.findUnique({
            where: {
                voteId_userId: {
                    voteId,
                    userId,
                },
            },
        });

        if (existingResponse) {
            throw new BadRequestException('Already voted');
        }

        // Validate option
        const options = JSON.parse(vote.options);
        if (!options.includes(option)) {
            throw new BadRequestException('Invalid option');
        }

        return this.prisma.voteResponse.create({
            data: {
                voteId,
                userId,
                option,
            },
        });
    }

    async deleteVote(voteId: string) {
        return this.prisma.vote.delete({
            where: { id: voteId },
        });
    }
}
