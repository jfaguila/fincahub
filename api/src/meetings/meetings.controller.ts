import { Controller, Get, Post, Delete, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class CreateMeetingDto {
    title: string;
    date: string;
    location: string;
    agenda: string;
    type: string; // ORDINARY | EXTRAORDINARY
}

class UpdateMinutesDto {
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
        const communityId = req.user.communityId || 'default';
        return this.meetingsService.createMeeting(
            communityId, req.user.userId, dto.title,
            new Date(dto.date), dto.location, dto.agenda, dto.type,
        );
    }

    @Patch(':id/minutes')
    async updateMinutes(@Param('id') id: string, @Body() dto: UpdateMinutesDto) {
        return this.meetingsService.updateMinutes(id, dto.minutes);
    }

    @Delete(':id')
    async deleteMeeting(@Param('id') id: string) {
        return this.meetingsService.deleteMeeting(id);
    }
}
