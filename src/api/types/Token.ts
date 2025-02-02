export interface Token {
    id: string;
    sessionId?: string;
    token: string;
    userId?: string;
    platform: 'ios' | 'android' | 'web';
    username?: string;
    first_name?: string;
    last_name?: string;
    created_at: Date;
    updated_at: Date;
    expires_at?: Date;
}

export interface RegisterTokenPayload {
    sessionId?: string;
    token: string;
    userId?: string;
    platform: 'ios' | 'android' | 'web';
    username?: string;
    first_name?: string;
    last_name?: string;
    expires_at?: string; 
}

export interface UpdateTokenPayload {
    oldToken: string;
    newToken: string;
    userId?: string;
}