export class RegisterDto {
    email!: string;
    password!: string;
    name!: string;
    role?: 'ADMIN' | 'PRESIDENT' | 'NEIGHBOR';
}

export class LoginDto {
    email!: string;
    password!: string;
}
