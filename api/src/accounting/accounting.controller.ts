import { Controller, Get, Post, Body, Query, UseGuards, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { AccountingService } from './accounting.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthRequest } from '../common/auth-request.interface';

export class CreateAccountDto {
    name: string;
    type: string;
}

export class CreateTransactionDto {
    accountId: string;
    amount: number;
    type: string;
    category: string;
    description?: string;
}

export class CreateBudgetDto {
    year: number;
    totalAmount: number;
}

@Controller('accounting')
@UseGuards(JwtAuthGuard)
export class AccountingController {
    constructor(private accountingService: AccountingService) { }

    // Accounts
    @Get('accounts')
    async getAccounts(@Request() req: any) {
        // In production, get communityId from authenticated user
        const communityId = req.user.communityId || 'default';
        return this.accountingService.getAccounts(communityId);
    }

    @Post('accounts')
    async createAccount(@Body() dto: CreateAccountDto, @Request() req: any) {
        const communityId = req.user.communityId || 'default';
        return this.accountingService.createAccount(communityId, dto.name, dto.type);
    }

    // Transactions
    @Get('transactions')
    async getTransactions(
        @Request() req: any,
        @Query('accountId') accountId?: string,
        @Query('type') type?: string,
        @Query('category') category?: string,
    ) {
        const communityId = req.user.communityId || 'default';
        return this.accountingService.getTransactions(communityId, { accountId, type, category });
    }

    @Post('transactions')
    async createTransaction(@Body() dto: CreateTransactionDto, @Request() req: any) {
        const communityId = req.user.communityId || 'default';
        return this.accountingService.createTransaction(
            communityId,
            dto.accountId,
            dto.amount,
            dto.type,
            dto.category,
            dto.description || '',
        );
    }

    // Balance
    @Get('balance')
    async getBalance(@Request() req: any) {
        const communityId = req.user.communityId || 'default';
        return this.accountingService.getBalance(communityId);
    }

    @Post('sepa-xml')
    async generateSepa(@Body() body: { concept: string; amount: number }, @Request() req: any, @Res() res: any) {
        const communityId = req.user.communityId || 'default';
        try {
            const xml = await this.accountingService.generateSepaXml(communityId, body.concept, body.amount);

            res.set('Content-Type', 'text/xml');
            res.set('Content-Disposition', `attachment; filename="remesa_${new Date().getTime()}.xml"`);
            res.send(xml);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    }

    // Budgets
    @Get('budgets')
    async getBudgets(@Request() req: any) {
        const communityId = req.user.communityId || 'default';
        return this.accountingService.getBudgets(communityId);
    }

    @Post('budgets')
    async createBudget(@Body() dto: CreateBudgetDto, @Request() req: any) {
        const communityId = req.user.communityId || 'default';
        return this.accountingService.createBudget(communityId, dto.year, dto.totalAmount);
    }

    // Debt
    @Get('debt')
    async getDebtors(@Request() req: any) {
        const communityId = req.user.communityId || 'default';
        return this.accountingService.getDebtors(communityId);
    }

    // Settlement
    @Get('settlement')
    async getSettlement(@Request() req: any, @Query('year') year?: string) {
        const communityId = req.user.communityId || 'default';
        const targetYear = year ? parseInt(year) : new Date().getFullYear();
        return this.accountingService.getSettlement(communityId, targetYear);
    }
}
