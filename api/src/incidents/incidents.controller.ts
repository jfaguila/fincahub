import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IsString, MinLength, IsOptional, IsArray, IsIn } from 'class-validator';
import { IncidentsService } from './incidents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthRequest } from '../common/auth-request.interface';

export class CreateIncidentDto {
    @IsString()
    @MinLength(2)
    title: string;

    @IsString()
    @MinLength(5)
    description: string;

    @IsOptional()
    @IsArray()
    photos?: string[];
}

export class UpdateIncidentStatusDto {
    @IsString()
    @IsIn(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
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
    async updateStatus(@Param('id') id: string, @Body() dto: UpdateIncidentStatusDto, @Request() req: any) {
        const isAdminOrPresident = ['ADMIN', 'PRESIDENT'].includes(req.user.role);
        if (!isAdminOrPresident) {
            throw new ForbiddenException('Solo administradores o presidentes pueden cambiar el estado');
        }
        return this.incidentsService.updateIncidentStatus(id, dto.status);
    }

    @Delete(':id')
    async deleteIncident(@Param('id') id: string, @Request() req: any) {
        const incident = await this.incidentsService.findById(id);
        if (!incident) throw new NotFoundException('Incidencia no encontrada');
        const isAdminOrPresident = ['ADMIN', 'PRESIDENT'].includes(req.user.role);
        if (!isAdminOrPresident && incident.reportedById !== req.user.userId) {
            throw new ForbiddenException('No tienes permiso para eliminar esta incidencia');
        }
        return this.incidentsService.deleteIncident(id);
    }
}
