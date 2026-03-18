import { Controller, Post, Body, Get, Query, UseGuards, Request } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import type { AuthRequest } from '../common/auth-request.interface';

@Controller('auth')
@Throttle({ short: { ttl: 60000, limit: 10 } })
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto.email, dto.password, dto.name, dto.role, dto.communityName);
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto.email, dto.password);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Request() req: AuthRequest) {
        return this.authService.validateUser(req.user.userId);
    }

    @Post('forgot-password')
    @Throttle({ short: { ttl: 300000, limit: 3 } })
    async forgotPassword(@Body() body: { email: string }) {
        return this.authService.forgotPassword(body.email);
    }

    @Post('reset-password')
    @Throttle({ short: { ttl: 300000, limit: 5 } })
    async resetPassword(@Body() body: { token: string; password: string }) {
        return this.authService.resetPassword(body.token, body.password);
    }

    @Get('verify-email')
    async verifyEmail(@Query('token') token: string) {
        return this.authService.verifyEmail(token);
    }

    @Post('resend-verification')
    @Throttle({ short: { ttl: 300000, limit: 3 } })
    async resendVerification(@Body() body: { email: string }) {
        return this.authService.resendVerification(body.email);
    }
}
