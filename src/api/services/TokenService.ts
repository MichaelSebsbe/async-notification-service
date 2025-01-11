import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';

import { Token, RegisterTokenPayload, UpdateTokenPayload} from '../types/Token';

export class TokenService {
    private db: Database;

    constructor() {
        // NOTE: Database path should come from configuration
        this.db = new sqlite3.Database('notifications.db', (err) => {
            if (err) console.error('Database connection failed:', err);
            else this.initializeTable();
        });
    }

    private initializeTable(): void {
        const sql = `
            CREATE TABLE IF NOT EXISTS tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                token TEXT NOT NULL,
                user_id INT NOT NULL,
                platform TEXT NOT NULL,
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
                INSERT INTO tokens (token, user_id, platform)
                VALUES (?, ?, ?)
                RETURNING *;
            `;
            
            this.db.get(sql, [payload.token, payload.userId, payload.platform], (err, row) => {
                if (err) {
                    // Handle unique constraint violation
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return reject(new Error('Token User Pair already exists'));
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

    private mapRowToToken(row: any): Token {
        return {
            id: row.id,
            token: row.token,
            userId: row.user_id,
            platform: row.platform,
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
