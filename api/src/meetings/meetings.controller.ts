import { Controller, Get, Post, Delete, Patch, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { IsString, MinLength, IsOptional, IsDateString, IsIn } from 'class-validator';
import { MeetingsService } from './meetings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class CreateMeetingDto {
    @IsString()
    @MinLength(2)
    title: string;

    @IsDateString()
    date: string;

    @IsString()
    @MinLength(2)
    location: string;

    @IsString()
    @MinLength(5)
    agenda: string;

    @IsString()
    @IsIn(['ORDINARY', 'EXTRAORDINARY'])
    type: string;
}

class UpdateMinutesDto {
    @IsString()
    @MinLength(5)
    minutes: string;
}

@Controller('meetings')
@UseGuards(JwtAuthGuard)
export class MeetingsController {
    constructor(private meetingsService: MeetingsService) { }

    @Get()
    async getMeetings(@Request() req: any) {
        const communityId = req.user.communityId || 'default';
        return this.meetingsService.getMeetings(communityId);
    }

    @Post()
    async createMeeting(@Body() dto: CreateMeetingDto, @Request() req: any) {
        const isAdminOrPresident = ['ADMIN', 'PRESIDENT'].includes(req.user.role);
        if (!isAdminOrPresident) {
            throw new ForbiddenException('Solo administradores o presidentes pueden crear juntas');
        }
        const communityId = req.user.communityId || 'default';
        return this.meetingsService.createMeeting(
            communityId, req.user.userId, dto.title,
            new Date(dto.date), dto.location, dto.agenda, dto.type,
        );
    }

    @Patch(':id/minutes')
    async updateMinutes(@Param('id') id: string, @Body() dto: UpdateMinutesDto, @Request() req: any) {
        const isAdminOrPresident = ['ADMIN', 'PRESIDENT'].includes(req.user.role);
        if (!isAdminOrPresident) {
            throw new ForbiddenException('Solo administradores o presidentes pueden añadir actas');
        }
        return this.meetingsService.updateMinutes(id, dto.minutes);
    }

    @Delete(':id')
    async deleteMeeting(@Param('id') id: string, @Request() req: any) {
        const isAdminOrPresident = ['ADMIN', 'PRESIDENT'].includes(req.user.role);
        if (!isAdminOrPresident) {
            throw new ForbiddenException('Solo administradores o presidentes pueden eliminar juntas');
        }
        return this.meetingsService.deleteMeeting(id);
    }
}
