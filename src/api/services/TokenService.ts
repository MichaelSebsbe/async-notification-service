// import sqlite3 from 'sqlite3';

import db from '../config/db';

import { Token, RegisterTokenPayload, UpdateTokenPayload} from '../types/Token';

export class TokenService {
    private db = db;

    constructor() {
        this.initializeTable();
    }

    private initializeTable(): void {
        const sql = `
            CREATE TABLE IF NOT EXISTS tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                token TEXT NOT NULL,
                user_id TEXT NOT NULL,
                platform TEXT NOT NULL,
                username TEXT,
                first_name TEXT,
                last_name TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(token, user_id)
            )
        `;

        this.db.run(sql, (err) => {
            if (err) console.error('Table creation failed:', err);
        });
    }

    async register(payload: RegisterTokenPayload): Promise<Token> {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO tokens (token, user_id, username, first_name, last_name, platform)
                VALUES (?, ?, ?, ?, ?, ?)
                RETURNING *;
            `;
            
            this.db.get(sql, [payload.token, payload.userId, payload.username, payload.first_name, payload.last_name, payload.platform], (err, row) => {
                if (err) {
                    // Handle unique constraint violation
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return reject(new Error('Token User_id Pair already exists'));
                    }
                    return reject(err);
                }

                if (!row) {
                    return reject(new Error('Failed to create token'));
                }

                resolve(this.mapRowToToken(row));
            });
        });
    }

    async removeByToken(token: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM tokens WHERE token = ?';
            
            this.db.run(sql, [token], (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    async removeByUser(userId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM tokens WHERE user_id = ?';
            
            this.db.run(sql, [userId], (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    async removeBySession(sessionId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM tokens WHERE id = ?';
            
            console.log(sessionId);

            this.db.run(sql, [sessionId], function(err) {
                if (err) return reject(err);
                if (this.changes === 0) return reject(new Error('Token not found id: ' + sessionId));
                resolve();
            });
        });
    }

    async update(payload: UpdateTokenPayload): Promise<Token> {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE tokens 
                SET token = ?, updated_at = datetime('now')
                WHERE token = ?
                RETURNING *;
            `;
            
            this.db.get(sql, [payload.newToken, payload.oldToken], (err, row) => {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        reject(new Error('New token already exists'));
                    }
                    reject(err);
                }
                if (!row) {
                    reject(new Error('Token not found'));
                }
                resolve(this.mapRowToToken(row));
            });
        });
    }

    async getAllTokens(): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT distinct token, platform FROM tokens';
            
            this.db.all(sql, [], (err, rows) => {
                if (err) return reject(err);

                resolve(rows);
            });
        });
    }

    async getTokenByUserids(userIds: string[]): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            const placeholders = userIds.map(() => '?').join(',');
            const sql = `SELECT token, platform FROM tokens WHERE user_id IN (${placeholders})`;

            this.db.all(sql, userIds, (err: Error | null, rows: any[]) => {
                if (err) return reject(err);

                resolve(rows);

                console.log(rows);
            });
        });
    }

    async getTokenByPlatforms(platforms: string[]): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT token, platform FROM tokens WHERE platform IN ("' + platforms.join('","') + '")';
            console.log(sql);
            
            this.db.all(sql, [], (err, rows) => {
                if (err) return reject(err);

                resolve(rows);
            });
        });
    }

    private mapRowToToken(row: any): Token {
        return {
            id: row.id,
            token: row.token,
            userId: row.user_id,
            platform: row.platform,
            username: row.username,
            first_name: row.first_name,
            last_name: row.last_name,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
        };
    }

    // Clean up database connection
    async close(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
}
