/**
 * Script para crear el Super Admin en producción.
 * Ejecutar una sola vez desde Railway o localmente con DATABASE_URL apuntando a producción.
 *
 * Uso:
 *   DATABASE_URL="postgresql://..." npx ts-node prisma/create-admin.ts
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'info@fincahub.com';
    const password = 'FincaHub2026!';

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log(`✓ El admin ya existe (${email}) — rol: ${existing.role}`);
        return;
    }

    await prisma.user.create({
        data: {
            email,
            password: await bcrypt.hash(password, 10),
            name: 'Super Admin',
            role: 'ADMIN',
        },
    });

    console.log('✅ Super Admin creado:');
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n⚠️  Cambia la contraseña tras el primer login.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
