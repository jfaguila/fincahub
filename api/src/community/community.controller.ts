import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, UploadedFile, UseInterceptors, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { IsString, MinLength, MaxLength, IsNumber, IsOptional, IsEmail, Min, Max } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { CommunityService } from './community.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthRequest } from '../common/auth-request.interface';

function requireCommunity(req: any): string {
    if (!req.user?.communityId) throw new UnauthorizedException('No asociado a ninguna comunidad');
    return req.user.communityId;
}

export class CreatePropertyDto {
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    unit: string;

    @IsNumber()
    @Min(0)
    @Max(999)
    floor: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 4 })
    @Min(0.0001)
    @Max(100)
    coefficient?: number;
}

export class UpdatePropertyDto {
    @IsOptional()
    @IsString()
    @MaxLength(20)
    unit?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(999)
    floor?: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 4 })
    @Min(0.0001)
    @Max(100)
    coefficient?: number;
}

export class UpdateNeighborDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    role?: string;
}

@Controller('community')
@UseGuards(JwtAuthGuard)
export class CommunityController {
    constructor(private communityService: CommunityService) { }

    // Properties
    @Get('properties')
    async getProperties(@Request() req: any) {
        const communityId = requireCommunity(req);
        return this.communityService.getProperties(communityId);
    }

    @Post('properties')
    async createProperty(@Body() dto: CreatePropertyDto, @Request() req: any) {
        const communityId = requireCommunity(req);
        return this.communityService.createProperty(communityId, dto.unit, dto.floor, dto.coefficient);
    }

    @Put('properties/:id')
    async updateProperty(@Param('id') id: string, @Body() dto: UpdatePropertyDto) {
        return this.communityService.updateProperty(id, dto);
    }

    // Neighbors
    @Get('neighbors')
    async getNeighbors(@Request() req: any) {
        const communityId = requireCommunity(req);
        return this.communityService.getNeighbors(communityId);
    }

    @Post('neighbors')
    async createNeighbor(@Body() body: { name: string; email: string; role?: string; unit?: string; iban?: string }, @Request() req: any) {
        const communityId = requireCommunity(req);
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

    @Post('neighbors/import')
    @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
    async importNeighbors(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
        if (!file) throw new BadRequestException('No se ha subido ningún archivo.');
        const communityId = requireCommunity(req);

        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Skip header row, expect columns: nombre, email, vivienda, iban
        const results: { success: string[]; errors: string[] } = { success: [], errors: [] };

        for (let i = 1; i < rows.length; i++) {
            const [name, email, unit, iban] = rows[i].map((v: any) => (v !== undefined && v !== null ? String(v).trim() : ''));
            if (!name || !email) continue;

            try {
                await this.communityService.createNeighbor(communityId, name, email, 'NEIGHBOR', unit || undefined, iban || undefined);
                results.success.push(email);
            } catch (e: any) {
                results.errors.push(`${email}: ${e.message || 'Error'}`);
            }
        }

        return results;
    }

    // Community info
    @Get()
    async getCommunity(@Request() req: any) {
        const communityId = requireCommunity(req);
        return this.communityService.getCommunity(communityId);
    }

    @Put()
    async updateCommunity(@Body() data: any, @Request() req: any) {
        const communityId = requireCommunity(req);
        return this.communityService.updateCommunity(communityId, data);
    }
}
