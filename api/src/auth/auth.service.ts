import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private mailService: MailService,
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

        const trialEndsAt = new Date();
        trialEndsAt.setDate(trialEndsAt.getDate() + 30);

        // Generate email verification token
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');

        // Use a transaction to create user, community, default account, and default spaces
        const result = await this.prisma.$transaction(async (tx) => {
            // Create user (unverified)
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role,
                    emailVerificationToken,
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
                        trialEndsAt,
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

        // Send verification email (fire & forget)
        this.mailService.sendEmailVerification(result.email, result.name, emailVerificationToken).catch(() => null);

        return {
            message: 'Cuenta creada. Por favor revisa tu email y confirma tu dirección para acceder.',
            email: result.email,
        };
    }

    async verifyEmail(token: string) {
        const user = await this.prisma.user.findUnique({
            where: { emailVerificationToken: token },
        });

        if (!user) {
            throw new BadRequestException('El enlace de verificación no es válido o ya fue usado.');
        }

        await this.prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: true, emailVerificationToken: null },
        });

        const jwt = this.generateToken(user.id, user.email, user.role, user.communityId);

        return {
            token: jwt,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                communityId: user.communityId,
            },
        };
    }

    async resendVerification(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        // Always return success to avoid email enumeration
        if (!user || user.emailVerified) {
            return { message: 'Si el email existe y no está verificado, recibirás un nuevo enlace.' };
        }

        const newToken = crypto.randomBytes(32).toString('hex');
        await this.prisma.user.update({
            where: { id: user.id },
            data: { emailVerificationToken: newToken },
        });

        this.mailService.sendEmailVerification(user.email, user.name, newToken).catch(() => null);

        return { message: 'Si el email existe y no está verificado, recibirás un nuevo enlace.' };
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
        const token = this.generateToken(user.id, user.email, user.role, user.communityId);

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

    async forgotPassword(email: string) {
        // Always return success to avoid email enumeration
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) return { message: 'Si existe una cuenta con ese email, recibirás un enlace.' };

        // Invalidate any existing tokens
        await this.prisma.passwordResetToken.updateMany({
            where: { userId: user.id, used: false },
            data: { used: true },
        });

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

        await this.prisma.passwordResetToken.create({
            data: { token, expiresAt, userId: user.id },
        });

        await this.mailService.sendPasswordReset(user.email, user.name, token);

        return { message: 'Si existe una cuenta con ese email, recibirás un enlace.' };
    }

    async resetPassword(token: string, newPassword: string) {
        const resetToken = await this.prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
            throw new BadRequestException('El enlace no es válido o ha expirado.');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: resetToken.userId },
                data: { password: hashedPassword },
            }),
            this.prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { used: true },
            }),
        ]);

        return { message: 'Contraseña actualizada correctamente.' };
    }

    private generateToken(userId: string, email: string, role: string, communityId?: string | null): string {
        const payload = { sub: userId, email, role, communityId: communityId || null };
        return this.jwtService.sign(payload);
    }
}
