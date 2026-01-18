import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
    constructor(private prisma: PrismaService) { }

    async getBookings(communityId: string) {
        return this.prisma.booking.findMany({
            where: { communityId },
            include: {
                space: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { date: 'desc' },
        });
    }

    async createBooking(
        communityId: string,
        userId: string,
        spaceId: string,
        date: Date,
        startTime: string,
        endTime: string,
    ) {
        // Check for conflicts (simplified - in production you'd check full overlap logic)
        const existingBooking = await this.prisma.booking.findFirst({
            where: {
                spaceId,
                date,
                OR: [
                    {
                        startTime: { lte: startTime },
                        endTime: { gt: startTime },
                    },
                    {
                        startTime: { lt: endTime },
                        endTime: { gte: endTime },
                    },
                ],
            },
        });

        if (existingBooking) {
            throw new BadRequestException('Time slot already booked');
        }

        return this.prisma.booking.create({
            data: {
                communityId,
                userId,
                spaceId,
                date,
                startTime,
                endTime,
            },
            include: {
                space: true,
            },
        });
    }

    async getSpaces(communityId: string) {
        return this.prisma.space.findMany({
            where: { communityId },
            include: {
                _count: {
                    select: { bookings: true },
                },
            },
        });
    }

    async createSpace(communityId: string, name: string, description?: string) {
        return this.prisma.space.create({
            data: {
                communityId,
                name,
                description,
            },
        });
    }

    async deleteBooking(bookingId: string) {
        return this.prisma.booking.delete({
            where: { id: bookingId },
        });
    }
}
