import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(email: string, password: string, name: string, role: string = 'NEIGHBOR', communityName?: string) {
        // Check if user exists
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // If role is PRESIDENT, communityName is required
        if (role === 'PRESIDENT' && !communityName) {
            throw new BadRequestException('Community name is required for president registration');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Use a transaction to create user, community, default account, and default spaces
        const result = await this.prisma.$transaction(async (tx) => {
            // Create user
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    communityId: true,
                    createdAt: true,
                },
            });

            // If PRESIDENT, create community with defaults and associate user
            if (role === 'PRESIDENT' && communityName) {
                const community = await tx.community.create({
                    data: {
                        name: communityName,
                        address: '',
                    },
                });

                // Associate user with community
                const updatedUser = await tx.user.update({
                    where: { id: user.id },
                    data: { communityId: community.id },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true,
                        communityId: true,
                        createdAt: true,
                    },
                });

                // Create default bank account
                await tx.account.create({
                    data: {
                        name: 'Cuenta Principal',
                        type: 'BANK',
                        balance: 0,
                        communityId: community.id,
                    },
                });

                // Create default spaces
                await tx.space.createMany({
                    data: [
                        { name: 'Sala de Reuniones', communityId: community.id },
                        { name: 'Pista de Pádel', communityId: community.id },
                    ],
                });

                return updatedUser;
            }

            return user;
        });

        // Generate token
        const token = this.generateToken(result.id, result.email, result.role);

        return {
            user: result,
            token,
        };
    }

    async login(email: string, password: string) {
        // Find user
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate token
        const token = this.generateToken(user.id, user.email, user.role);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                createdAt: user.createdAt,
            },
            token,
        };
    }

    async validateUser(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                communityId: true,
            },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user;
    }

    private generateToken(userId: string, email: string, role: string): string {
        const payload = { sub: userId, email, role };
        return this.jwtService.sign(payload);
    }
}
