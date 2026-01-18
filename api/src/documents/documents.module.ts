import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { AccountingModule } from '../accounting/accounting.module';

@Module({
    imports: [AccountingModule], // Reduce duplication by importing module
    controllers: [DocumentsController],
    providers: [DocumentsService],
})
export class DocumentsModule { }
