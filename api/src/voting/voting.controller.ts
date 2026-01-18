import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { VotingService } from './voting.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthRequest } from '../common/auth-request.interface';

export class CreateVoteDto {
    question: string;
    description: string;
    options: string[];
    deadline: string; // ISO date
}

export class CastVoteDto {
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
    async deleteVote(@Param('id') id: string) {
        return this.votingService.deleteVote(id);
    }
}
