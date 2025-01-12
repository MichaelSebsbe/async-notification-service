export interface NotificationPayload {
    title: string;
    body: string;
    data?: Record<string, any>;
}
  
export interface SendNotificationResponse {
    success: boolean;
    sent: number;
    failed: number;
    errors?: string[];
}
  
export interface PlatformNotificationPayload extends NotificationPayload {
    platforms: ('ios' | 'android' | 'web')[];
}