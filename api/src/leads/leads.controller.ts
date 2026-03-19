import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { IsEmail } from 'class-validator';

class CreateLeadDto {
  @IsEmail()
  email: string;
}

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() dto: CreateLeadDto) {
    await this.leadsService.create(dto.email);
    return { ok: true };
  }
}
