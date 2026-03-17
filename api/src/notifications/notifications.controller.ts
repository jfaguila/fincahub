import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private notificationsService: NotificationsService) { }

    @Get()
    async getAll(@Request() req: any) {
        return this.notificationsService.findForUser(req.user.userId);
    }

    @Get('unread-count')
    async getUnreadCount(@Request() req: any) {
        const count = await this.notificationsService.countUnread(req.user.userId);
        return { count };
    }

    @Post(':id/read')
    async markRead(@Param('id') id: string, @Request() req: any) {
        return this.notificationsService.markRead(id, req.user.userId);
    }

    @Post('read-all')
    async markAllRead(@Request() req: any) {
        return this.notificationsService.markAllRead(req.user.userId);
    }
}
