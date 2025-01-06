import { Request, Response } from 'express';
import { NotificationService } from '../services/NotificationService';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  public broadcast = async (req: Request, res: Response) => {
    try {
      const response = await this.notificationService.broadcast(req.body);
      res.json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ success: false, sent: 0, failed: 1, errors: [errorMessage] });
    }
  };

  public sendToUsers = async (req: Request, res: Response) => {
    try {
      const { userIds, ...payload } = req.body;
      const response = await this.notificationService.sendToUsers(userIds, payload);
      res.json(response);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ success: false, sent: 0, failed: 1, errors: [errorMessage] });
    }
  };

  public sendToPlatforms = async (req: Request, res: Response) => {
    try {
      const response = await this.notificationService.sendToPlatforms(req.body);
      res.json(response);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ success: false, sent: 0, failed: 1, errors: [errorMessage] });
    }
  };

  public sendToToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const response = await this.notificationService.sendToToken(token, req.body);
      res.json(response);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ success: false, sent: 0, failed: 1, errors: [errorMessage] });
    }
  };
}
