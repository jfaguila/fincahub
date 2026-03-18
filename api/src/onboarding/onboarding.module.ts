import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { OnboardingService } from './onboarding.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [ScheduleModule.forRoot(), PrismaModule, MailModule],
    providers: [OnboardingService],
})
export class OnboardingModule { }
