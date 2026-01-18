import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AccountingModule,
    CommunityModule,
    IncidentsModule,
    DocumentsModule,
    BookingsModule,
    VotingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
