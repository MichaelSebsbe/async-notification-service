export interface Token {
    id: string;
    token: string;
    userId?: number;
    platform: 'ios' | 'android' | 'web';
    username?: string;
    first_name?: string;
    last_name?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RegisterTokenPayload {
    token: string;
    userId?: number;
    platform: 'ios' | 'android' | 'web';
    username?: string;
    first_name?: string;
    last_name?: string;
}

export interface UpdateTokenPayload {
    oldToken: string;
    newToken: string;
    userId?: number;
}