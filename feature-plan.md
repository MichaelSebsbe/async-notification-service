# New Notification Feature Plan

## Express.js Endpoints
1. Register user and assign a token.  
2. Remove token by user or by token identifier.  
3. Update a user's token.  
4. Handle tokens without user IDs (unregistered/anonymous).

## Lightweight SQL Database Schema
1. Define a table for tokens with fields for token value, optional user ID, creation date, etc.  
2. Implement CRUD operations in Express.js routes.  
3. Use migrations or a minimal SQL script to manage schema changes.

## Next Steps
1. Implement and test Express.js routes.  
2. Integrate database logic.  
3. Validate token management flow.

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
CREATE TABLE tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token VARCHAR(255) NOT NULL UNIQUE,
  user_id VARCHAR(255),
  platform VARCHAR(10) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tokens_user_id ON tokens(user_id);
CREATE INDEX idx_tokens_token ON tokens(token);
```
