# Notification Service API Documentation

## ✨ Key Features
- **Anonymous Token Registration**: Register device tokens before user authentication, enabling notifications for users who haven't logged in yet (e.g., newly downloaded apps)
- **Multi-Device Support**: Allows multiple unique tokens per user, enabling notifications across all user's devices
- **Multi-Account Support**: Supports multiple users/sessions with the same device token, perfect for apps that allow multiple account logins on a single device
- **Platform Flexibility**: Designed for iOS, Android(coming soon), and Web platforms(coming soon)
- **Flexible Targeting**: Send notifications by user IDs, device tokens, platforms, or broadcast to all
- **Management Portal**: Optional web interface for sending broadcast notifications
- **Session Management**: Track and manage tokens by session IDs for better user experience

This service manages device tokens for push notifications across different platforms (iOS, Android, and Web).
> NOTE: Android and Web are not yet implemented 

## 🔐 Authentication
All API requests require an `ns-api-key` to be included in the request headers that matches the `API_KEY` you provided in your .env file:

## 🛠️ Management Portal
If `CREATE_MANAGEMENT_PORTAL = true`, a `/management` route is enabled to show simple portal for sending broadcast notifications to all registered tokens.

![Management Portal](portal.png)

## 📋 Endpoints

### 🩺 Health Check
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Check API health status |

### 🔑 Token Management

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/notifications/token` | Register a new device token |
| DELETE | `/api/notifications/token/:token` | Remove a specific token |
| DELETE | `/api/notifications/user/:userId/token` | Remove all tokens for a user |
| DELETE | `/api/notifications/session/:sessionId` | Remove token by session ID |
| PUT | `/api/notifications/token` | Update an existing token |

### 📤 Send Notifications

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/notifications/broadcast` | Broadcast notification to all registered devices |
| POST | `/api/notifications/users` | Send notification to specific users |
| POST | `/api/notifications/platforms` | Send notification to specific platforms |
| POST | `/api/notifications/tokens` | Send notification to a specific token |

## 📄 Request/Response Formats

### Register Token (POST `/api/notifications/token`)
**Request Body:**
```json
{
    "sessionId": "string" (optional),
    "token": "string",
    "userId": "string" (optional),
    "platform": "ios" | "android" | "web",
    "username": "string" (optional),
    "first_name": "string" (optional),
    "last_name" : "string" (optional),
}
```
**Response:** (201 Created)
```json
{
    "id": "string",
    "sessionId": "string",
    "token": "string",
    "userId": "string" (optional),
    "platform": "ios" | "android" | "web",
    "createdAt": "date",
    "updatedAt": "date"
}
```

### Update Token (PUT `/api/notifications/token`)
**Request Body:**
```json
{
    "oldToken": "string",
    "newToken": "string",
    "userId": "string" (optional)
}
```
**Response:** (200 OK)
```json
{
    "id": "string",
    "sessionId": "string",
    "token": "string",
    "userId": "string" (optional),
    "platform": "ios" | "android" | "web",
    "createdAt": "date",
    "updatedAt": "date"
}
```

### Remove Token (DELETE `/api/notifications/token/:token`)
**Parameters:**
- `token`: The device token to remove

**Response:** (200 OK)
```json
{
    "success": true
}
```

### Remove User Tokens (DELETE `/api/notifications/user/:userId/token`)
**Parameters:**
- `userId`: The user ID whose tokens should be removed

**Response:** (200 OK)
```json
{
    "success": true
}
```

### Remove Session Token (DELETE `/api/notifications/session/:sessionId`)
**Parameters:**
- `sessionId`: The sessionId whose token should be removed

**Response:** (200 OK)
```json
{
    "success": true
}
```

## 📤 Sending Notifications
### Broadcast Notification (POST `/api/notifications/broadcast`)
**Request Body:**
```json
{
    "title": "string",
    "body": "string",
    "data": object (optional)
}
```
**Response:** (200 OK)
```json
{
    "success": boolean,
    "sent": number,
    "failed": number,
    "errors": string[] (optional)
}
```

### Send to Users (POST `/api/notifications/users`)
**Request Body:**
```json
{
    "userIds": "string"[],
    "title": "string",
    "body": "string",
    "data": object (optional)
}
```
**Response:** (200 OK)
```json
{
    "success": boolean,
    "sent": number,
    "failed": number,
    "errors": string[] (optional)
}
```

### Send to Platforms (POST `/api/notifications/platforms`)
**Request Body:**
```json
{
    "platforms": ("ios" | "android" | "web")[], //android and web not implemented yet
    "title": "string",
    "body": "string",
    "data": object (optional)
}
```
**Response:** (200 OK)
```json
{
    "success": boolean,
    "sent": number,
    "failed": number,
    "errors": string[] (optional)
}
```

### Send to Token (POST `/api/notifications/tokens`)

**Request Body:**
```json
{   
    "tokens": string[],
    "title": "string",
    "body": "string",
    "data": object (optional)
}
```
**Response:** (200 OK)
```json
{
    "success": boolean,
    "sent": number,
    "failed": number,
    "errors": string[] (optional)
}
```

## ❌ Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Missing required fields |
| 404 | Not Found - Endpoint doesn't exist |
| 409 | Conflict - Token already exists |
| 500 | Internal Server Error |

## 📱 Platform Support
The service supports the following platforms:
- iOS (`ios`)
- Android (`android`)
- Web (`web`)
> NOTE: Android and Web are not yet implemented