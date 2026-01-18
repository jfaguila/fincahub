import { Request as ExpressRequest } from 'express';

export interface AuthRequest extends ExpressRequest {
    user: {
        userId: string;
        email: string;
        role: string;
        communityId?: string;
    };
}
