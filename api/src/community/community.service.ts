import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CommunityService {
    constructor(private prisma: PrismaService) { }

    // Properties
    async getProperties(communityId: string) {
        return this.prisma.property.findMany({
            where: { communityId },
            include: {
                owners: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: [{ floor: 'asc' }, { unit: 'asc' }],
        });
    }

    async createProperty(communityId: string, unit: string, floor: number, coefficient: number = 1.0) {
        return this.prisma.property.create({
            data: {
                communityId,
                unit,
                floor,
                coefficient,
            },
        });
    }

    async createNeighbor(communityId: string, name: string, email: string, role: string = 'NEIGHBOR', unit?: string, iban?: string) {
        // Log input for debugging
        console.log(`[CreateNeighbor] Starting creation for: ${email}, unit: ${unit}, iban: ${iban}`);

        try {
            const existingUser = await this.prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                console.warn(`[CreateNeighbor] User already exists: ${email}`);
                throw new BadRequestException('El usuario con este email ya existe.');
            }

            const hashedPassword = await bcrypt.hash('password123', 10);

            const user = await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role,
                    communityId,
                    iban, // Save IBAN
                },
            });
            console.log(`[CreateNeighbor] User created with ID: ${user.id}`);

            if (unit) {
                // Check if property exists first to avoid duplicate unit errors if unique constraint exists
                // For this demo, we assume we just want to create it.
                // However, let's wrap in try catch specifically for property
                try {
                    await this.prisma.property.create({
                        data: {
                            unit,
                            floor: 1,
                            communityId,
                            owners: {
                                connect: { id: user.id }
                            }
                        }
                    });
                    console.log(`[CreateNeighbor] Property created: ${unit}`);
                } catch (propError) {
                    console.error(`[CreateNeighbor] Property creation failed for unit ${unit}:`, propError);
                    // Don't fail the whole user creation if property fails, but log it
                }
            }

            return user;
        } catch (error) {
            console.error('[CreateNeighbor] Critical Error:', error);
            throw error;
        }
    }

    async updateProperty(propertyId: string, data: { unit?: string; floor?: number; coefficient?: number }) {
        return this.prisma.property.update({
            where: { id: propertyId },
            data,
        });
    }

    // Neighbors (Users)
    async getNeighbors(communityId: string) {
        return this.prisma.user.findMany({
            where: { communityId },
            include: {
                properties: {
                    select: {
                        id: true,
                        unit: true,
                        floor: true,
                        coefficient: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
    }

    async updateNeighbor(userId: string, data: { name?: string; email?: string; role?: any; iban?: string }) {
        return this.prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                properties: true,
            },
        });
    }

    async assignPropertyToNeighbor(userId: string, propertyId: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                properties: {
                    connect: { id: propertyId },
                },
            },
        });
    }

    // Community info
    async getCommunity(communityId: string) {
        return this.prisma.community.findUnique({
            where: { id: communityId },
            include: {
                _count: {
                    select: {
                        users: true,
                        properties: true,
                    },
                },
            },
        });
    }

    async updateCommunity(communityId: string, data: { name?: string; address?: string; bankAccount?: string }) {
        return this.prisma.community.update({
            where: { id: communityId },
            data,
        });
    }
}
