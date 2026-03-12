import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountingService {
    constructor(private prisma: PrismaService) { }

    async getAccounts(communityId: string) {
        return this.prisma.account.findMany({ where: { communityId } });
    }

    async createAccount(communityId: string, name: string, type: string, initialBalance: number = 0) {
        return this.prisma.account.create({
            data: {
                communityId,
                name,
                type,
                balance: initialBalance
            }
        });
    }

    async getTransactions(communityId: string, options?: { accountId?: string; type?: string; category?: string }) {
        const where: any = {
            account: { communityId },
        };

        if (options?.accountId) where.accountId = options.accountId;
        if (options?.type) where.type = options.type;
        if (options?.category) where.category = options.category;

        return this.prisma.transaction.findMany({
            where,
            orderBy: { date: 'desc' },
            take: 50,
        });
    }

    async createTransaction(communityId: string, accountId: string, amount: number, type: string, category: string, description: string) {
        const account = await this.prisma.account.findUnique({ where: { id: accountId } });
        if (!account) throw new Error('Account not found');

        // Create tx
        const tx = await this.prisma.transaction.create({
            data: {
                accountId,
                amount,
                type,
                category,
                description,
            },
        });

        // Update balance
        const balanceChange = type === 'INCOME' ? amount : -amount;
        await this.prisma.account.update({
            where: { id: accountId },
            data: { balance: { increment: balanceChange } },
        });

        return tx;
    }

    async getBalance(communityId: string) {
        const accounts = await this.prisma.account.findMany({ where: { communityId } });
        const total = accounts.reduce((acc, curr) => acc + curr.balance, 0);
        return { totalBalance: total };
    }

    // --- Budgets ---
    async getBudgets(communityId: string) {
        return this.prisma.budget.findMany({ where: { communityId } });
    }

    async createBudget(communityId: string, year: number, totalAmount: number) {
        return this.prisma.budget.create({
            data: {
                communityId,
                year,
                totalAmount
            }
        });
    }

    // --- Debtors (based on real transactions) ---
    async getDebtors(communityId: string) {
        // Get all neighbors with their properties
        const neighbors = await this.prisma.user.findMany({
            where: { communityId, role: 'NEIGHBOR' },
            include: { properties: true }
        });

        // Get total income by user (payments received from neighbors)
        // In this model, debtors are neighbors with no INCOME transactions linked to them
        // We compare expected quota (budget / neighbors) vs actual payments
        const budget = await this.prisma.budget.findFirst({
            where: { communityId, year: new Date().getFullYear() }
        });

        const totalBudget = budget?.totalAmount ?? 0;
        const monthlyQuota = neighbors.length > 0 ? totalBudget / 12 / neighbors.length : 0;
        const currentMonth = new Date().getMonth() + 1;

        // Get accounts for this community
        const accounts = await this.prisma.account.findMany({ where: { communityId } });
        const accountIds = accounts.map((a: { id: string }) => a.id);

        // Get income transactions for the current year grouped by month
        const currentYear = new Date().getFullYear();
        const incomeTransactions = await this.prisma.transaction.findMany({
            where: {
                accountId: { in: accountIds },
                type: 'INCOME',
                category: { contains: 'Cuota' },
                date: {
                    gte: new Date(currentYear, 0, 1),
                    lte: new Date()
                }
            }
        });

        // Calculate how many quota months have been collected
        const monthsCollected = monthlyQuota > 0
            ? Math.round(incomeTransactions.reduce((sum: number, t: { amount: number }) => sum + t.amount, 0) / (monthlyQuota * neighbors.length))
            : 0;

        const debtors = [];

        for (const neighbor of neighbors) {
            // A neighbor is considered a debtor if the community has fewer months collected than expected
            const monthsOverdue = Math.max(0, currentMonth - monthsCollected);

            if (monthsOverdue > 0 && monthlyQuota > 0) {
                debtors.push({
                    id: neighbor.id,
                    name: neighbor.name,
                    email: neighbor.email,
                    unit: neighbor.properties[0]?.unit || 'S/N',
                    debtAmount: Number((monthsOverdue * monthlyQuota).toFixed(2)),
                    monthsOverdue
                });
            }
        }

        return debtors;
    }

    // --- SEPA XML GENERATION Mock ---
    async generateSepaXml(communityId: string, concept: string, amountPerNeighbor: number) {
        // 1. Get neighbors with IBAN
        const neighbors = await this.prisma.user.findMany({
            where: { communityId, iban: { not: null } },
            select: { name: true, iban: true }
        });

        if (neighbors.length === 0) {
            throw new Error('No hay vecinos con IBAN registrado para generar remesa.');
        }

        const totalAmount = neighbors.length * amountPerNeighbor;
        const msgId = `MSG-${Date.now()}`;
        const createDate = new Date().toISOString();

        // 2. Build XML string (Simplified ISO 20022 PAIN.008 format)
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.008.001.02">
  <CstmrDrctDbtInitn>
    <GrpHdr>
        <MsgId>${msgId}</MsgId>
        <CreDtTm>${createDate}</CreDtTm>
        <NbOfTxs>${neighbors.length}</NbOfTxs>
        <CtrlSum>${totalAmount.toFixed(2)}</CtrlSum>
        <InitgPty>
            <Nm>FINCAHUB COMMUNITY</Nm>
        </InitgPty>
    </GrpHdr>
    <PmtInf>
        <PmtInfId>PMT-${Date.now()}</PmtInfId>
        <PmtMtd>DD</PmtMtd>
        <NbOfTxs>${neighbors.length}</NbOfTxs>
        <CtrlSum>${totalAmount.toFixed(2)}</CtrlSum>
        <PmtTpInf>
            <SvcLvl><Cd>SEPA</Cd></SvcLvl>
            <LclInstrm><Cd>CORE</Cd></LclInstrm>
            <SeqTp>RCUR</SeqTp>
        </PmtTpInf>
        <ReqdColltnDt>${new Date().toISOString().split('T')[0]}</ReqdColltnDt>
        <Cdtr>
            <Nm>FINCAHUB ADMIN</Nm>
        </Cdtr>
        <CdtrAcct>
            <Id><IBAN>ES9800000000000000000000</IBAN></Id>
        </CdtrAcct>
        <CdtrAgt>
            <FinInstnId><BIC>TESTBICXXX</BIC></FinInstnId>
        </CdtrAgt>
`;

        // Add Transactions
        neighbors.forEach((neighbor, index) => {
            xml += `        <DrctDbtTxInf>
            <PmtId>
                <EndToEndId>TX-${Date.now()}-${index}</EndToEndId>
            </PmtId>
            <InstdAmt Ccy="EUR">${amountPerNeighbor.toFixed(2)}</InstdAmt>
            <DrctDbtTx>
                <MndtRltdInf>
                    <MndtId>MANDATE-${index}</MndtId>
                    <DtOfSgntr>2024-01-01</DtOfSgntr>
                </MndtRltdInf>
            </DrctDbtTx>
            <DbtrAgt>
                <FinInstnId><Othr><Id>NOTPROVIDED</Id></Othr></FinInstnId>
            </DbtrAgt>
            <Dbtr>
                <Nm>${neighbor.name}</Nm>
            </Dbtr>
            <DbtrAcct>
                <Id><IBAN>${neighbor.iban}</IBAN></Id>
            </DbtrAcct>
            <RmtInf>
                <Ustrd>${concept}</Ustrd>
            </RmtInf>
        </DrctDbtTxInf>
`;
        });

        xml += `    </PmtInf>
  </CstmrDrctDbtInitn>
</Document>`;

        return xml;
    }

    // --- Settlement (Liquidación) ---
    async getSettlement(communityId: string, year: number) {
        // 1. Calculate Date Range
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);

        // 3. Get Total Expenses
        const expenses = await this.prisma.transaction.aggregate({
            _sum: { amount: true },
            where: {
                account: { communityId },
                type: 'EXPENSE',
                date: { gte: startDate, lte: endDate }
            }
        });

        const totalExpenses = expenses._sum.amount || 0;

        // 4. Get Properties and Calculate Share
        const properties = await this.prisma.property.findMany({
            where: { communityId },
            include: { owners: { select: { name: true } } }
        });

        const settlementLines = properties.map(prop => {
            const quota = totalExpenses * (prop.coefficient / 100);
            return {
                unit: prop.unit,
                ownerName: prop.owners.map(o => o.name).join(', ') || 'Sin Propietario',
                coefficient: prop.coefficient,
                quota: Number(quota.toFixed(2))
            };
        });

        return {
            year,
            totalExpenses,
            lines: settlementLines
        };
    }
}
