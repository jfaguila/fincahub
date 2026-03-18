import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { IsString, MinLength, IsOptional, IsArray, ArrayMinSize, IsDateString } from 'class-validator';
import { VotingService } from './voting.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthRequest } from '../common/auth-request.interface';

export class CreateVoteDto {
    @IsString()
    @MinLength(5)
    question: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsArray()
    @ArrayMinSize(2)
    @IsString({ each: true })
    options: string[];

    @IsDateString()
    deadline: string;
}

export class CastVoteDto {
    @IsString()
    @MinLength(1)
    option: string;
}

@Controller('voting')
@UseGuards(JwtAuthGuard)
export class VotingController {
    constructor(private votingService: VotingService) { }

    @Get()
    async getVotes(@Request() req: any) {
        const communityId = req.user.communityId || 'default';
        return this.votingService.getVotes(communityId);
    }

    @Post()
    async createVote(@Body() dto: CreateVoteDto, @Request() req: any) {
        const isAdminOrPresident = ['ADMIN', 'PRESIDENT'].includes(req.user.role);
        if (!isAdminOrPresident) {
            throw new ForbiddenException('Solo administradores o presidentes pueden crear votaciones');
        }
        const communityId = req.user.communityId || 'default';
        return this.votingService.createVote(
            communityId,
            dto.question,
            dto.description,
            dto.options,
            new Date(dto.deadline),
        );
    }

    @Post(':id/cast')
    async castVote(@Param('id') id: string, @Body() dto: CastVoteDto, @Request() req: any) {
        return this.votingService.castVote(id, req.user.userId, dto.option);
    }

    @Delete(':id')
    async deleteVote(@Param('id') id: string, @Request() req: any) {
        const isAdminOrPresident = ['ADMIN', 'PRESIDENT'].includes(req.user.role);
        if (!isAdminOrPresident) {
            throw new ForbiddenException('Solo administradores o presidentes pueden eliminar votaciones');
        }
        return this.votingService.deleteVote(id);
    }
}
