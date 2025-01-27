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
}

