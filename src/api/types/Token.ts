export interface Token {
    id: string;
    sessionId?: string;
    token: string;
    userId?: string;
    platform: 'ios' | 'android' | 'web';
    username?: string;
    first_name?: string;
    last_name?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RegisterTokenPayload {
    sessionId?: string;
    token: string;
    userId?: string;
    platform: 'ios' | 'android' | 'web';
    username?: string;
    first_name?: string;
    last_name?: string;
}

export interface UpdateTokenPayload {
    oldToken: string;
    newToken: string;
    userId?: string;
}