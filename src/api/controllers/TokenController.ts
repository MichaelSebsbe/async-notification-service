import { Request, Response } from 'express';
import { TokenService } from '../services/TokenService';
import { RegisterTokenPayload, UpdateTokenPayload } from '../types/Token';

export class TokenController {
    private tokenService: TokenService;
    
    constructor() {
        this.tokenService = new TokenService();
    }

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const payload: RegisterTokenPayload = req.body;
            
            if (!payload.token || !payload.platform) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }

            const token = await this.tokenService.register(payload);
            res.status(201).json(token);
        } catch (error: unknown) {
            if (error instanceof Error && error.message === 'Token already exists') {
                res.status(409).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    removeByToken = async (req: Request, res: Response): Promise<void> => {
        try {
            const { token } = req.params;
            
            await this.tokenService.removeByToken(token);
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    removeByUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            
            await this.tokenService.removeByUser(userId);
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
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
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}

