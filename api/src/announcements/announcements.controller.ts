import { Controller, Get, Post, Delete, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class CreateAnnouncementDto {
    title: string;
    content: string;
    pinned?: boolean;
}

@Controller('announcements')
@UseGuards(JwtAuthGuard)
export class AnnouncementsController {
    constructor(private announcementsService: AnnouncementsService) { }

    @Get()
    async getAnnouncements(@Request() req: any) {
        const communityId = req.user.communityId || 'default';
        return this.announcementsService.getAnnouncements(communityId);
    }

    @Post()
    async createAnnouncement(@Body() dto: CreateAnnouncementDto, @Request() req: any) {
        const communityId = req.user.communityId || 'default';
        return this.announcementsService.createAnnouncement(
            communityId, req.user.userId, dto.title, dto.content, dto.pinned || false,
        );
    }

    @Delete(':id')
    async deleteAnnouncement(@Param('id') id: string) {
        return this.announcementsService.deleteAnnouncement(id);
    }

    @Patch(':id/pin')
    async togglePin(@Param('id') id: string) {
        return this.announcementsService.togglePin(id);
    }
}
