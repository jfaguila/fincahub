import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IsString, MinLength, IsOptional, IsDateString, Matches } from 'class-validator';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthRequest } from '../common/auth-request.interface';

export class CreateBookingDto {
    @IsString()
    spaceId: string;

    @IsDateString()
    date: string;

    @IsString()
    @Matches(/^\d{2}:\d{2}$/, { message: 'startTime must be HH:MM' })
    startTime: string;

    @IsString()
    @Matches(/^\d{2}:\d{2}$/, { message: 'endTime must be HH:MM' })
    endTime: string;
}

export class CreateSpaceDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsOptional()
    @IsString()
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
    async deleteBooking(@Param('id') id: string, @Request() req: any) {
        const booking = await this.bookingsService.findById(id);
        if (!booking) throw new NotFoundException('Reserva no encontrada');
        const isAdminOrPresident = ['ADMIN', 'PRESIDENT'].includes(req.user.role);
        if (!isAdminOrPresident && booking.userId !== req.user.userId) {
            throw new ForbiddenException('No tienes permiso para cancelar esta reserva');
        }
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
