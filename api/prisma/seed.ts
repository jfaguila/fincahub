import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');

    // Skip if already seeded
    const existing = await prisma.user.findUnique({ where: { email: 'presidente@fincahub.com' } });
    if (existing) {
        console.log('Database already seeded, skipping...');
        return;
    }

    // Create default community
    const community = await prisma.community.upsert({
        where: { id: 'default' },
        update: {},
        create: {
            id: 'default',
            name: 'Residencial Las Palmeras',
            address: 'Calle Principal 123, Madrid',
            bankAccount: 'ES12 1234 1234 1234 1234',
        },
    });

    console.log('✓ Community created');

    // Create spaces
    const space1 = await prisma.space.create({
        data: {
            name: 'Pista de Pádel 1',
            description: 'Pista principal',
            community: { connect: { id: community.id } },
        },
    });

    const space2 = await prisma.space.create({
        data: {
            name: 'Sala Social',
            description: 'Para eventos y reuniones',
            community: { connect: { id: community.id } },
        },
    });

    console.log('✓ Spaces created');

    // Create users
    const president = await prisma.user.create({
        data: {
            email: 'presidente@fincahub.com',
            password: await bcrypt.hash('password123', 10),
            name: 'Juan Presidente',
            role: 'PRESIDENT',
            communityId: community.id,
        },
    });

    const neighbor1 = await prisma.user.create({
        data: {
            email: 'vecino1@fincahub.com',
            password: await bcrypt.hash('password123', 10),
            name: 'María García',
            role: 'NEIGHBOR',
            communityId: community.id,
        },
    });

    const neighbor2 = await prisma.user.create({
        data: {
            email: 'vecino2@fincahub.com',
            password: await bcrypt.hash('password123', 10),
            name: 'Pedro López',
            role: 'NEIGHBOR',
            communityId: community.id,
        },
    });

    console.log('✓ Users created');

    // Create properties
    const prop1 = await prisma.property.create({
        data: {
            unit: '3ºA',
            floor: 3,
            coefficient: 1.2,
            communityId: community.id,
            owners: {
                connect: [{ id: neighbor1.id }],
            },
        },
    });

    const prop2 = await prisma.property.create({
        data: {
            unit: '2ºB',
            floor: 2,
            coefficient: 1.0,
            communityId: community.id,
            owners: {
                connect: [{ id: neighbor2.id }],
            },
        },
    });

    console.log('✓ Properties created');

    // Create account
    const mainAccount = await prisma.account.create({
        data: {
            name: 'Cuenta Principal',
            type: 'BANK',
            balance: 24500,
            communityId: community.id,
        },
    });

    console.log('✓ Account created');

    // Create transactions
    await prisma.transaction.createMany({
        data: [
            {
                accountId: mainAccount.id,
                amount: 1500,
                type: 'INCOME',
                category: 'Cuotas Ordinarias',
                description: 'Cuota Enero 2026',
                date: new Date('2026-01-05'),
            },
            {
                accountId: mainAccount.id,
                amount: 850,
                type: 'EXPENSE',
                category: 'Mantenimiento',
                description: 'Reparación ascensor',
                date: new Date('2026-01-10'),
            },
            {
                accountId: mainAccount.id,
                amount: 2000,
                type: 'INCOME',
                category: 'Cuotas Ordinarias',
                description: 'Cuota Febrero 2026',
                date: new Date('2026-02-05'),
            },
        ],
    });

    console.log('✓ Transactions created');

    // Create budget
    await prisma.budget.create({
        data: {
            year: 2026,
            totalAmount: 50000,
            communityId: community.id,
        },
    });

    console.log('✓ Budget created');

    // Create incidents
    await prisma.incident.createMany({
        data: [
            {
                title: 'Luz fundida en portal',
                description: 'La bombilla del tercer piso está fundida',
                status: 'OPEN',
                communityId: community.id,
                reportedById: neighbor1.id,
            },
            {
                title: 'Fuga de agua',
                description: 'Hay una pequeña fuga en el garaje',
                status: 'IN_PROGRESS',
                communityId: community.id,
                reportedById: neighbor2.id,
            },
        ],
    });

    console.log('✓ Incidents created');

    // Create documents
    await prisma.document.createMany({
        data: [
            {
                name: 'Acta Junta Enero 2026',
                url: '/documents/acta-2026-01.pdf',
                category: 'ACTA',
                communityId: community.id,
                uploadedById: president.id,
            },
            {
                name: 'Contrato Ascensor',
                url: '/documents/contrato-ascensor.pdf',
                category: 'CONTRATO',
                communityId: community.id,
                uploadedById: president.id,
            },
        ],
    });

    console.log('✓ Documents created');

    // Create booking
    await prisma.booking.create({
        data: {
            spaceId: space1.id,
            userId: neighbor1.id,
            communityId: community.id,
            date: new Date('2026-01-20'),
            startTime: '18:00',
            endTime: '20:00',
        },
    });

    console.log('✓ Booking created');

    // Create vote
    const vote = await prisma.vote.create({
        data: {
            question: '¿Aprueba el presupuesto para 2026?',
            description: 'Votación sobre el presupuesto comunitario',
            options: JSON.stringify(['A favor', 'En contra', 'Abstención']),
            deadline: new Date('2027-12-31'),
            communityId: community.id,
        },
    });

    await prisma.voteResponse.create({
        data: {
            voteId: vote.id,
            userId: neighbor1.id,
            option: 'A favor',
        },
    });

    console.log('✓ Vote created');

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📧 Test credentials:');
    console.log('President: presidente@fincahub.com / password123');
    console.log('Neighbor 1: vecino1@fincahub.com / password123');
    console.log('Neighbor 2: vecino2@fincahub.com / password123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
