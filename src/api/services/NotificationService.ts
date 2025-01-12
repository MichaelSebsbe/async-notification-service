import { NotificationPayload, PlatformNotificationPayload, SendNotificationResponse } from '../types/Notification';
import RabbitMQ from '../config/RabbitMQ';
import { TokenService } from './TokenService';

interface MobileRegID {
  token: string;
  platform: string;
}

export class NotificationService {
  private tokenService: TokenService;

  constructor() {
    this.tokenService = new TokenService();
  }

  async broadcast(payload: NotificationPayload): Promise<SendNotificationResponse> {
    try {
      const tokens = await this.tokenService.getAllTokens() as MobileRegID[];
      return this.sendNotifications(tokens, payload);

    } catch (error) {
      return {
        success: false,
        sent: 0,
        failed: 0,
        errors: [(error as Error).message]
      };
    }
  }

  async sendToUsers(userIds: number[], payload: NotificationPayload): Promise<SendNotificationResponse> {
    return {
      success: false,
      sent: 0,
      failed: 0,
      errors: [`SendToUsers service called with ${userIds.length} users but not implemented`]
    };
  }

  async sendToPlatforms(payload: PlatformNotificationPayload): Promise<SendNotificationResponse> {
    return {
      success: false,
      sent: 0,
      failed: 0,
      errors: ['SendToPlatforms service called but not implemented']
    };
  }

  async sendToToken(token: string, payload: NotificationPayload): Promise<SendNotificationResponse> {
    return {
      success: false,
      sent: 0,
      failed: 0,
      errors: [`SendToToken service called with token: ${token} but not implemented`]
    };
  }

  private async sendNotifications(tokens: MobileRegID[], payload: NotificationPayload): Promise<SendNotificationResponse> {
    const title = payload.title;
    const body = payload.body;
    const data = payload.data;

    //publish to rabbitmq
    const rabbitMQ = RabbitMQ.getInstance();
    
    rabbitMQ.send(JSON.stringify({ title, body, data, tokens }));

    return {
      success: true,
      sent: tokens.length,
      failed: 0
    };
  }

  private async sendPlatformNotification(
    token: string,
    platform: string,
    payload: NotificationPayload
  ): Promise<void> {
    // Implementation needed
  }
}