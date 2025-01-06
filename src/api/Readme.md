# Notification Service API Documentation

This service manages device tokens for push notifications across different platforms (iOS, Android, and Web).

## Endpoints

### Health Check
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Check API health status |

### Token Management

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/notifications/token` | Register a new device token |
| DELETE | `/api/notifications/token/:token` | Remove a specific token |
| DELETE | `/api/notifications/user/:userId/token` | Remove all tokens for a user |
| PUT | `/api/notifications/token` | Update an existing token |

## Request/Response Formats

### Register Token (POST `/api/notifications/token`)
**Request Body:**
```json
{
    "token": "string",
    "userId": "string" (optional),
    "platform": "ios" | "android" | "web"
}
```
**Response:** (201 Created)
```json
{
    "id": "string",
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

## Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Missing required fields |
| 404 | Not Found - Endpoint doesn't exist |
| 409 | Conflict - Token already exists |
| 500 | Internal Server Error |

## Platform Support
The service supports the following platforms:
- iOS (`ios`)
- Android (`android`)
- Web (`web`)
