import { Request, Response } from 'express';
import { TokenService } from '../services/TokenService';
import { RegisterTokenPayload, UpdateTokenPayload } from '../types/Token';

import { ControllerErrorHandling } from './ControllerErrorHandling';

export class TokenController extends ControllerErrorHandling {
    private tokenService: TokenService;
    
    constructor() {
        super();
        this.tokenService = new TokenService();
    }

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const payload: RegisterTokenPayload = req.body;
            
            if (!payload.token || !payload.platform) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }

            if (payload.expires_at) {
                payload.expires_at = this.validateAndFormatUTC(payload.expires_at);
            }

            const token = await this.tokenService.register(payload);
            res.status(201).json(token);
        } catch (error: unknown) {
            this.handleError(error, res);
        }
    };

    removeByToken = async (req: Request, res: Response): Promise<void> => {
        try {
            const { token } = req.params;
            
            await this.tokenService.removeByToken(token);
            res.status(200).json({ success: true });
        } catch (error: unknown) {
            this.handleError(error, res);
        }
    };

    removeByUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            
            await this.tokenService.removeByUser(userId);
            res.status(200).json({ success: true });
        } catch (error: unknown) {
            this.handleError(error, res);
        }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const payload: UpdateTokenPayload = req.body;
            
            if (!payload.oldToken || !payload.newToken) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }

            const token = await this.tokenService.update(payload);
            res.status(200).json(token);
        } catch (error: unknown) {
            this.handleError(error, res);
        }
    };

    removeBySession = async (req: Request, res: Response): Promise<void> => {
        try {
            const { sessionId } = req.params;
            
            await this.tokenService.removeBySession(sessionId);
            res.status(200).json({ success: true });
        } catch (error: unknown) {
            this.handleError(error, res);
        }
    };

    private validateAndFormatUTC(dateStr: string): string {     
        // Regex for ISO 8601 with mandatory timezone
        const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
        if (!iso8601Regex.test(dateStr)) {
            throw new Error("Datetime must be in ISO 8601 format with explicit timezone (e.g., '2023-10-05T12:00:00Z'). Provided: " + dateStr);
        }

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          throw new Error("Invalid date format.");
        }
      
        // Helper to pad numbers with a leading zero if necessary
        const pad = (num: number): string => num.toString().padStart(2, '0');
      
        // Format using the UTC values
        const year = date.getUTCFullYear();
        const month = pad(date.getUTCMonth() + 1); // Months are 0-indexed
        const day = pad(date.getUTCDate());
        const hours = pad(date.getUTCHours());
        const minutes = pad(date.getUTCMinutes());
        const seconds = pad(date.getUTCSeconds());
      
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}

