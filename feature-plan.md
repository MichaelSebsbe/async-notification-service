# New Notification Feature Plan

## Express.js Endpoints
1. Register user and assign a token.  
2. Remove token by user or by token identifier.  
3. Update a user's token.  
4. Handle tokens without user IDs (unregistered/anonymous).

## Lightweight SQL Database Schema
1. Define a table for tokens using SQLite syntax.
2. Implement CRUD operations in Express.js routes using the `sqlite3` package.
3. Use a simple SQL initialization script for schema setup.

## Next Steps
1. Install and configure SQLite and sqlite3 npm package.
2. Implement and test Express.js routes.
3. Create database initialization script.
4. Validate token management flow.

## Implementation Details

### Types
```typescript
interface Token {
  id: string;
  token: string;
  userId?: number;
  platform: 'ios' | 'android' | 'web';
  createdAt: Date;
  updatedAt: Date;
}

interface RegisterTokenPayload {
  token: string;
  userId?: number;
  platform: 'ios' | 'android' | 'web';
}

interface UpdateTokenPayload {
  oldToken: string;
  newToken: string;
  userId?: number;
}

interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
}

interface SendNotificationResponse {
  success: boolean;
  sent: number;
  failed: number;
  errors?: string[];
}

interface PlatformNotificationPayload extends NotificationPayload {
  platforms: ('ios' | 'android' | 'web')[];
}
```

### API Endpoints

#### Register Token
- **POST** `/api/notifications/token`
- Payload: `RegisterTokenPayload`
- Response: `Token`
- Description: Register new token, optionally associate with user

#### Remove Token by User
- **DELETE** `/api/notifications/user/:userId/token`
- Response: `{ success: boolean }`
- Description: Remove all tokens associated with user

#### Remove Token by Value
- **DELETE** `/api/notifications/token/:token`
- Response: `{ success: boolean }`
- Description: Remove specific token

#### Update Token
- **PUT** `/api/notifications/token`
- Payload: `UpdateTokenPayload`
- Response: `Token`
- Description: Update existing token value

#### Send Notification to All Users
- **POST** `/api/notifications/broadcast`
- Payload: `NotificationPayload`
- Response: `SendNotificationResponse`
- Description: Send notification to all registered tokens

#### Send Notification to User Group
- **POST** `/api/notifications/users`
- Payload: `NotificationPayload & { userIds: number[] }`
- Response: `SendNotificationResponse`
- Description: Send notification to specific users by their IDs

#### Send Notification by Platform
- **POST** `/api/notifications/platforms`
- Payload: `PlatformNotificationPayload`
- Response: `SendNotificationResponse`
- Description: Send notification to all users on specified platforms

#### Send Notification to Specific Token
- **POST** `/api/notifications/token/:token`
- Payload: `NotificationPayload`
- Response: `SendNotificationResponse`
- Description: Send notification to a specific token

### Database Schema
```sql
CREATE TABLE IF NOT EXISTS tokens (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  token TEXT NOT NULL UNIQUE,
  user_id INTEGER,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_tokens_user_id ON tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_tokens_token ON tokens(token);
```

### SQLite Configuration
```javascript
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('notifications.db', (err) => {
  if (err) console.error('Database connection failed:', err);
  console.log('Connected to SQLite database');
});
```
````
