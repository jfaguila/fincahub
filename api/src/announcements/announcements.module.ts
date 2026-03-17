import { Module } from '@nestjs/common';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [PrismaModule, MailModule, NotificationsModule],
    controllers: [AnnouncementsController],
    providers: [AnnouncementsService],
})
export class AnnouncementsModule { }
