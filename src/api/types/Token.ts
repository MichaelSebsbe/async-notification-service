export interface Token {
    id: string;
    token: string;
    userId?: number;
    platform: 'ios' | 'android' | 'web';
    createdAt: Date;
    updatedAt: Date;
}

export interface RegisterTokenPayload {
    token: string;
    userId?: number;
    platform: 'ios' | 'android' | 'web';
}

export interface UpdateTokenPayload {
    oldToken: string;
    newToken: string;
    userId?: number;
}