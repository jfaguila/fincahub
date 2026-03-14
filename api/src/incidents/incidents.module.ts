import { Module } from '@nestjs/common';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [MailModule],
    controllers: [IncidentsController],
    providers: [IncidentsService],
})
export class IncidentsModule { }
