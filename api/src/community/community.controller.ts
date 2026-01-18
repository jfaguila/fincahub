import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CommunityService } from './community.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthRequest } from '../common/auth-request.interface';

export class CreatePropertyDto {
    unit: string;
    floor: number;
    coefficient?: number;
}

export class UpdatePropertyDto {
    unit?: string;
    floor?: number;
    coefficient?: number;
}

export class UpdateNeighborDto {
    name?: string;
    email?: string;
    role?: string;
}

@Controller('community')
@UseGuards(JwtAuthGuard)
export class CommunityController {
    constructor(private communityService: CommunityService) { }

    // Properties
    @Get('properties')
    async getProperties(@Request() req: any) {
        const communityId = req.user.communityId || 'default';
        return this.communityService.getProperties(communityId);
    }

    @Post('properties')
    async createProperty(@Body() dto: CreatePropertyDto, @Request() req: any) {
        const communityId = req.user.communityId || 'default';
        return this.communityService.createProperty(communityId, dto.unit, dto.floor, dto.coefficient);
    }

    @Put('properties/:id')
    async updateProperty(@Param('id') id: string, @Body() dto: UpdatePropertyDto) {
        return this.communityService.updateProperty(id, dto);
    }

    // Neighbors
    @Get('neighbors')
    async getNeighbors(@Request() req: any) {
        const communityId = req.user.communityId || 'default';
        return this.communityService.getNeighbors(communityId);
    }

    @Post('neighbors')
    async createNeighbor(@Body() body: { name: string; email: string; role?: string; unit?: string; iban?: string }, @Request() req: any) {
        const communityId = req.user.communityId || 'default';
        return this.communityService.createNeighbor(communityId, body.name, body.email, body.role, body.unit, body.iban);
    }

    @Put('neighbors/:id')
    async updateNeighbor(@Param('id') id: string, @Body() dto: UpdateNeighborDto) {
        return this.communityService.updateNeighbor(id, dto);
    }

    @Post('neighbors/:userId/assign-property/:propertyId')
    async assignProperty(@Param('userId') userId: string, @Param('propertyId') propertyId: string) {
        return this.communityService.assignPropertyToNeighbor(userId, propertyId);
    }

    // Community info
    @Get()
    async getCommunity(@Request() req: any) {
        const communityId = req.user.communityId || 'default';
        return this.communityService.getCommunity(communityId);
    }

    @Put()
    async updateCommunity(@Body() data: any, @Request() req: any) {
        const communityId = req.user.communityId || 'default';
        return this.communityService.updateCommunity(communityId, data);
    }
}
