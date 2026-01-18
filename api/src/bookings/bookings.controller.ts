import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthRequest } from '../common/auth-request.interface';

export class CreateBookingDto {
    spaceId: string;
    date: string; // ISO date
    startTime: string;
    endTime: string;
}

export class CreateSpaceDto {
    name: string;
    description?: string;
}

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
    constructor(private bookingsService: BookingsService) { }

    @Get()
    async getBookings(@Request() req: any) {
        const communityId = req.user.communityId || 'default';
        return this.bookingsService.getBookings(communityId);
    }

    @Post()
    async createBooking(@Body() dto: CreateBookingDto, @Request() req: any) {
        const communityId = req.user.communityId || 'default';
        return this.bookingsService.createBooking(
            communityId,
            req.user.userId,
            dto.spaceId,
            new Date(dto.date),
            dto.startTime,
            dto.endTime,
        );
    }

    @Delete(':id')
    async deleteBooking(@Param('id') id: string) {
        return this.bookingsService.deleteBooking(id);
    }

    @Get('spaces')
    async getSpaces(@Request() req: any) {
        const communityId = req.user.communityId || 'default';
        return this.bookingsService.getSpaces(communityId);
    }

    @Post('spaces')
    async createSpace(@Body() dto: CreateSpaceDto, @Request() req: any) {
        const communityId = req.user.communityId || 'default';
        return this.bookingsService.createSpace(communityId, dto.name, dto.description);
    }
}
