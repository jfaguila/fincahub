import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AccountingModule } from './accounting/accounting.module';
import { CommunityModule } from './community/community.module';
import { IncidentsModule } from './incidents/incidents.module';
import { DocumentsModule } from './documents/documents.module';
import { BookingsModule } from './bookings/bookings.module';
import { VotingModule } from './voting/voting.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { MeetingsModule } from './meetings/meetings.module';
import { BillingModule } from './billing/billing.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 10,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    MailModule,
    AuthModule,
    AccountingModule,
    CommunityModule,
    IncidentsModule,
    DocumentsModule,
    BookingsModule,
    VotingModule,
    AnnouncementsModule,
    MeetingsModule,
    BillingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
