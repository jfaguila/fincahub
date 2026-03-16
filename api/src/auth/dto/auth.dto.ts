import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

export class RegisterDto {
    @IsString()
    @MinLength(2)
    name!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8)
    password!: string;

    @IsOptional()
    @IsIn(['ADMIN', 'PRESIDENT', 'NEIGHBOR'])
    role?: 'ADMIN' | 'PRESIDENT' | 'NEIGHBOR';

    @IsOptional()
    @IsString()
    @MinLength(2)
    communityName?: string;
}

export class LoginDto {
    @IsEmail()
    email!: string;

    @IsString()
    password!: string;
}
