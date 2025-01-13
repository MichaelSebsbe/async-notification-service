# Notification Service

A Node.js service that handles push notifications using RabbitMQ as a message broker. Currently supports iOS push notifications via Apple Push Notification service (APNs).

## Notification Methods

This service provides two distinct ways to send notifications:
1. **Direct RabbitMQ Integration**: Connect directly to the RabbitMQ message broker to send notifications (see [Message Format](#message-format) below)
2. **HTTP API**: Use the REST API endpoints to send notifications and manage device tokens. 
(see [API Documentation](src/api/Readme.md))

> **Note**: Device token management (registration, updates, deletion) is only available through the HTTP API.

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- Apple Developer Account credentials for iOS push notifications

## Setup

1. Clone the repository
2. Install dependencies:
```sh
npm install
```

3. Create a `.env` file in the root directory with the following configuration:
```
RABBITMQ_URL = "amqp://localhost"
RABBITMQ_QUEUE_NAME = "test_queue"

APN_TEAM_ID = "YOUR_TEAM_ID"
APN_KEY_ID = "YOUR_KEY_ID"
APN_KEY_PATH = "./IOS/AuthKey_YOUR_KEY_ID.p8"
APN_TOPIC = "your.app.bundle.id"

APN_TEST_DEVICE_TOKEN = "YOUR_DEVICE_TOKEN"
```

4. Place your APNs authentication key (`.p8` file) in the `IOS` directory

## Running the Service

1. Start RabbitMQ using Docker Compose:
```sh
docker-compose up -d
```

2. Build the TypeScript code:
```sh
npm run build
```

3. Start the service:
```sh
npm start
```

For development with hot-reload:
```sh
npm run dev
```

## How It Works

The service:
1. Connects to RabbitMQ on startup
2. Listens for notification messages on the configured queue
3. Processes messages and sends push notifications to iOS devices

### Message Format

Send JSON messages to RabbitMQ in the following format:
```json
{
  "title": "Notification Title",
  "body": "Notification Body",
  "tokens": ["device_token_1", "device_token_2"]
}
```

## Development

The project structure:
- `src/index.ts` - Main application entry point
- `RabbitMQ/RabbitMQ.ts` - RabbitMQ connection handling
- `Notification.ts` - Notification processing and sending logic

## Testing

Run tests using Jest:
```sh
npm test
```

## RabbitMQ Management

Access the RabbitMQ management interface at:
- URL: http://localhost:15672
- Username: guest
- Password: guest

## License

ISC
