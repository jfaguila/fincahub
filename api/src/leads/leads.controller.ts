import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { IsEmail, IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Throttle } from '@nestjs/throttler';

class CreateLeadDto {
  @IsEmail()
  email: string;
}

class ChatMessageDto {
  @IsString()
  role: 'user' | 'assistant';

  @IsString()
  content: string;
}

class ChatDto {
  @IsString()
  message: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  @IsOptional()
  history?: ChatMessageDto[];
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

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 5, ttl: 60000 }, long: { limit: 30, ttl: 60000 } })
  async chat(@Body() dto: ChatDto) {
    const reply = await this.leadsService.chat(dto.message, dto.history ?? []);
    return { reply };
  }
}
