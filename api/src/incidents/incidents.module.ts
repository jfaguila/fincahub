import { Module } from '@nestjs/common';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { MailModule } from '../mail/mail.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [MailModule, NotificationsModule],
    controllers: [IncidentsController],
    providers: [IncidentsService],
})
export class IncidentsModule { }
