import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthRequest } from '../common/auth-request.interface';
import { AccountingService } from '../accounting/accounting.service';
import { AiProcessorService } from './ai-processor.service';

export class UploadDocumentDto {
    name: string;
    url: string;
    category: string;
}

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
    constructor(
        private readonly documentsService: DocumentsService,
        private readonly accountingService: AccountingService,
        private readonly aiProcessor: AiProcessorService,
    ) { }

    @Get()
    async getDocuments(@Request() req: any, @Query('category') category?: string) {
        const communityId = req.user.communityId || 'default';
        return this.documentsService.getDocuments(communityId, category);
    }

    @Post('upload')
    async uploadDocument(@Body() body: { name: string; category: string; isSmartUpload?: boolean }, @Request() req: any) {
        const communityId = req.user.communityId || 'default';
        const userId = req.user.userId;

        const doc = await this.documentsService.uploadDocument(communityId, userId, body.name, 'http://placeholder.url', body.category);

        let autoCreatedTransaction = null;
        let aiAnalysis = null;

        if (body.isSmartUpload && body.category === 'FACTURA') {
            // Real AI analysis via Claude API (falls back to heuristics if not configured)
            const invoiceData = await this.aiProcessor.analyzeInvoice(body.name, body.category);
            aiAnalysis = invoiceData;

            let accounts = await this.accountingService.getAccounts(communityId);
            let targetAccountId: string;

            if (accounts.length === 0) {
                const defaultAccount = await this.accountingService.createAccount(communityId, 'Cuenta Principal', 'BANK', 0);
                targetAccountId = defaultAccount.id;
            } else {
                targetAccountId = accounts[0].id;
            }

            autoCreatedTransaction = await this.accountingService.createTransaction(
                communityId,
                targetAccountId,
                invoiceData.amount,
                'EXPENSE',
                invoiceData.category,
                `${invoiceData.description} | Proveedor: ${invoiceData.provider}`,
            );
        }

        return { ...doc, autoCreatedTransaction, aiAnalysis };
    }

    @Delete(':id')
    async deleteDocument(@Param('id') id: string) {
        return this.documentsService.deleteDocument(id);
    }
}
