import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthRequest } from '../common/auth-request.interface';
import { AccountingService } from '../accounting/accounting.service';

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
        private readonly accountingService: AccountingService // Inject accounting service
    ) { }

    @Get()
    async getDocuments(@Request() req: any, @Query('category') category?: string) {
        const communityId = req.user.communityId || 'default';
        return this.documentsService.getDocuments(communityId, category);
    }

    @Post('upload')
    async uploadDocument(@Body() body: { name: string; category: string; isSmartUpload?: boolean }, @Request() req: any) {
        console.log('Upload Document Request:', body);
        const communityId = req.user.communityId || 'default';
        const userId = req.user.userId;

        // Save document
        const doc = await this.documentsService.uploadDocument(communityId, userId, body.name, 'http://placeholder.url', body.category);

        let autoCreatedTransaction = null;
        if (body.isSmartUpload && body.category === 'FACTURA') {
            // --- AI SIMULATION ---
            // In a real app, this would use a Python Service or OCR API
            const simulatedAmount = parseFloat((Math.random() * 200 + 50).toFixed(2)); // Random amount between 50 and 250
            const simulatedProvider = body.name.split('.')[0] || 'Proveedor Desconocido';

            // Auto-create expense
            // Need a default account. Find first account.
            let accounts = await this.accountingService.getAccounts(communityId);
            let targetAccountId: string;

            if (accounts.length === 0) {
                // Create a default account if none exists
                console.log('No accounts found. Creating Default Account...');
                const defaultAccount = await this.accountingService.createAccount(communityId, 'Cuenta Principal', 'BANK', 0);
                targetAccountId = defaultAccount.id;
            } else {
                targetAccountId = accounts[0].id;
            }

            autoCreatedTransaction = await this.accountingService.createTransaction(
                communityId,
                targetAccountId,
                simulatedAmount,
                'EXPENSE',
                'Suministros (Auto-IA)',
                `Factura procesada: ${simulatedProvider}`
            );
        }

        return { ...doc, autoCreatedTransaction };
    }

    @Delete(':id')
    async deleteDocument(@Param('id') id: string) {
        return this.documentsService.deleteDocument(id);
    }
}
