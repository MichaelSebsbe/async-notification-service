//TODO: Add common controller methods here and change this class to Controller
import { Response } from 'express';

export class ControllerErrorHandling {
    protected defaultError = 'Internal server error';

    protected handleError (e: unknown, res: Response): void{
        if (e instanceof Error) {
            res.status(409).json({ error: e.message });
            return;
        }
        res.status(500).json({ error: this.defaultError });
    }
}