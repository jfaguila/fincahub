import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthRequest } from '../common/auth-request.interface';

export class CreateIncidentDto {
    title: string;
    description: string;
    photos?: string[];
}

export class UpdateIncidentStatusDto {
    status: string;
}

@Controller('incidents')
@UseGuards(JwtAuthGuard)
export class IncidentsController {
    constructor(private incidentsService: IncidentsService) { }

    @Get()
    async getIncidents(@Request() req: any, @Query('status') status?: string) {
        const communityId = req.user.communityId || 'default';
        return this.incidentsService.getIncidents(communityId, status);
    }

    @Post()
    async createIncident(@Body() dto: CreateIncidentDto, @Request() req: any) {
        const communityId = req.user.communityId || 'default';
        return this.incidentsService.createIncident(
            communityId,
            req.user.userId,
            dto.title,
            dto.description,
            dto.photos,
        );
    }

    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body() dto: UpdateIncidentStatusDto) {
        return this.incidentsService.updateIncidentStatus(id, dto.status);
    }

    @Delete(':id')
    async deleteIncident(@Param('id') id: string) {
        return this.incidentsService.deleteIncident(id);
    }
}
