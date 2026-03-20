import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsIn } from 'class-validator';

export class RegisterDto {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name!: string;

    @IsEmail()
    @MaxLength(255)
    email!: string;

    @IsString()
    @MinLength(8)
    @MaxLength(128)
    password!: string;

    @IsOptional()
    @IsIn(['ADMIN', 'PRESIDENT', 'NEIGHBOR'])
    role?: 'ADMIN' | 'PRESIDENT' | 'NEIGHBOR';

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(150)
    communityName?: string;
}

export class LoginDto {
    @IsEmail()
    @MaxLength(255)
    email!: string;

    @IsString()
    @MaxLength(128)
    password!: string;
}
