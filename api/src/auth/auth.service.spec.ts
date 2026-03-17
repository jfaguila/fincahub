import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockPrismaService = {
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
    community: {
        create: jest.fn(),
    },
    account: {
        create: jest.fn(),
    },
    space: {
        createMany: jest.fn(),
    },
    passwordResetToken: {
        findUnique: jest.fn(),
        create: jest.fn(),
        updateMany: jest.fn(),
        update: jest.fn(),
    },
    $transaction: jest.fn(),
};

const mockJwtService = {
    sign: jest.fn(() => 'mock-token'),
};

const mockMailService = {
    sendPasswordReset: jest.fn(),
};

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: JwtService, useValue: mockJwtService },
                { provide: MailService, useValue: mockMailService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should return token for valid credentials', async () => {
            const hashed = await bcrypt.hash('password123', 10);
            mockPrismaService.user.findUnique.mockResolvedValue({
                id: 'user-1',
                email: 'test@test.com',
                name: 'Test',
                password: hashed,
                role: 'PRESIDENT',
                createdAt: new Date(),
            });

            const result = await service.login('test@test.com', 'password123');
            expect(result.token).toBe('mock-token');
            expect(result.user.email).toBe('test@test.com');
        });

        it('should throw UnauthorizedException for unknown email', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            await expect(service.login('no@no.com', 'pass')).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException for wrong password', async () => {
            const hashed = await bcrypt.hash('correct', 10);
            mockPrismaService.user.findUnique.mockResolvedValue({
                id: 'u1', email: 'test@test.com', password: hashed, name: 'T', role: 'PRESIDENT', createdAt: new Date(),
            });
            await expect(service.login('test@test.com', 'wrong')).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('register', () => {
        it('should throw ConflictException if email already exists', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue({ id: 'existing' });
            await expect(
                service.register('existing@test.com', 'pass1234', 'User', 'PRESIDENT', 'Mi Comunidad'),
            ).rejects.toThrow(ConflictException);
        });

        it('should throw BadRequestException if president without communityName', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            await expect(
                service.register('new@test.com', 'pass1234', 'User', 'PRESIDENT', undefined),
            ).rejects.toThrow(BadRequestException);
        });

        it('should register and return token for new president', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            const userResult = {
                id: 'user-1',
                email: 'new@test.com',
                name: 'User',
                role: 'PRESIDENT',
                communityId: 'comm-1',
                createdAt: new Date(),
            };
            mockPrismaService.$transaction.mockImplementation(async (fn: any) => {
                return fn({
                    user: {
                        create: jest.fn().mockResolvedValue(userResult),
                        update: jest.fn().mockResolvedValue(userResult),
                    },
                    community: { create: jest.fn().mockResolvedValue({ id: 'comm-1', name: 'Comunidad' }) },
                    account: { create: jest.fn() },
                    space: { createMany: jest.fn() },
                });
            });

            const result = await service.register('new@test.com', 'pass1234', 'User', 'PRESIDENT', 'Comunidad');
            expect(result.token).toBe('mock-token');
            expect(result.user.email).toBe('new@test.com');
        });
    });

    describe('forgotPassword', () => {
        it('should always return success message', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            const result = await service.forgotPassword('notexist@test.com');
            expect(result.message).toContain('Si existe');
            expect(mockMailService.sendPasswordReset).not.toHaveBeenCalled();
        });

        it('should send reset email if user exists', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue({ id: 'u1', email: 'user@test.com', name: 'User' });
            mockPrismaService.passwordResetToken.updateMany.mockResolvedValue({ count: 0 });
            mockPrismaService.passwordResetToken.create.mockResolvedValue({ id: 'rt-1' });
            const result = await service.forgotPassword('user@test.com');
            expect(result.message).toContain('Si existe');
            expect(mockMailService.sendPasswordReset).toHaveBeenCalledWith('user@test.com', 'User', expect.any(String));
        });
    });

    describe('resetPassword', () => {
        it('should throw BadRequestException for invalid token', async () => {
            mockPrismaService.passwordResetToken.findUnique.mockResolvedValue(null);
            await expect(service.resetPassword('bad-token', 'newpass')).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException for expired token', async () => {
            mockPrismaService.passwordResetToken.findUnique.mockResolvedValue({
                id: 'rt-1',
                token: 'tok',
                used: false,
                expiresAt: new Date(Date.now() - 1000),
                user: { id: 'u1' },
                userId: 'u1',
            });
            await expect(service.resetPassword('tok', 'newpass')).rejects.toThrow(BadRequestException);
        });

        it('should update password for valid token', async () => {
            mockPrismaService.passwordResetToken.findUnique.mockResolvedValue({
                id: 'rt-1',
                token: 'valid-tok',
                used: false,
                expiresAt: new Date(Date.now() + 60000),
                user: { id: 'u1' },
                userId: 'u1',
            });
            mockPrismaService.$transaction.mockResolvedValue([null, null]);

            const result = await service.resetPassword('valid-tok', 'newpassword');
            expect(result.message).toContain('correctamente');
        });
    });
});
