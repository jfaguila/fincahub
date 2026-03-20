import { Controller, Get, Post, Delete, Patch, Body, Param, UseGuards, Request, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';
import { AnnouncementsService } from './announcements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class CreateAnnouncementDto {
    @IsString()
    @MinLength(2)
    title: string;

    @IsString()
    @MinLength(2)
    content: string;

    @IsOptional()
    @IsBoolean()
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
    async deleteAnnouncement(@Param('id') id: string, @Request() req: any) {
        const announcement = await this.announcementsService.findById(id);
        if (!announcement) throw new NotFoundException('Announcement not found');
        const isAdminOrPresident = ['ADMIN', 'PRESIDENT'].includes(req.user.role);
        if (!isAdminOrPresident && announcement.authorId !== req.user.userId) {
            throw new ForbiddenException('No tienes permiso para eliminar este anuncio');
        }
        return this.announcementsService.deleteAnnouncement(id);
    }

    @Patch(':id/pin')
    async togglePin(@Param('id') id: string) {
        return this.announcementsService.togglePin(id);
    }
}
