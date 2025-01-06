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
  userId?: string;
  platform: 'ios' | 'android' | 'web';
  createdAt: Date;
  updatedAt: Date;
}

interface RegisterTokenPayload {
  token: string;
  userId?: string;
  platform: 'ios' | 'android' | 'web';
}

interface UpdateTokenPayload {
  oldToken: string;
  newToken: string;
  userId?: string;
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

### Database Schema
```sql
CREATE TABLE IF NOT EXISTS tokens (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  token TEXT NOT NULL UNIQUE,
  user_id TEXT,
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
