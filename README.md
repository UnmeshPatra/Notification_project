# Notification Service

A scalable system to send notifications to users with support for multiple notification types and queue-based processing with automatic retries.

## Features

- RESTful API for sending and retrieving notifications
- Support for multiple notification types (email, SMS, in-app)
- Queue-based architecture for asynchronous notification processing
- Automatic retry mechanism for failed notifications
- MongoDB for persistent storage
- Redis for queue management
- Comprehensive error handling and logging
- API documentation

## Prerequisites

- Node.js (v14+)
- MongoDB
- Redis

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd notification-service
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and add the following:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/notification-service
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

   

## Running the Application

## Redis Setup

This application requires Redis for the notification queue system. Make sure Redis is running before starting the application.

### Local Redis Setup

1. Install Redis:
   - On macOS: `brew install redis`
   - On Ubuntu/Debian: `sudo apt-get install redis-server`
   - On Windows: Download from [Redis for Windows](https://github.com/tporadowski/redis/releases)

2. Start Redis server:
   - On macOS/Linux: `redis-server`
   - On Windows: Start the Redis service

### Using Docker for Redis

Alternatively, you can run Redis in Docker:

```bash
docker run -d -p 6379:6379 --name redis-server redis:latest
```


#### You can see more detailed information in the API documentation

### Production Mode
```bash
node app.js
```

## API Endpoints

### Send a Notification
```
POST /notifications
```
Request Body:
```json
{
  "userId": "123",
  "type": "email",
  "message": "Hello, this is a test notification!"
}
```

### Get User Notifications
```
GET /users/:id/notifications
```

### Get a Specific Notification
```
GET /notifications/:id
```

For complete API documentation, visit `/api-docs` when the server is running.

## Architecture

### Components

1. **API Layer**: Express.js application handling HTTP requests
2. **Storage Layer**: MongoDB for storing notification data
3. **Queue Layer**: Bull/Redis for handling asynchronous notification processing
4. **Service Layer**: Notification processors for different types (email, SMS, in-app)

### Flow

1. Client sends a notification request to the API
2. API validates the request and stores the notification in MongoDB with status "queued"
3. API adds the notification to the processing queue and returns a success response
4. Queue processor picks up the notification and attempts to send it
5. If successful, the notification status is updated to "sent"
6. If failed, the system will retry up to the configured maximum attempts
7. After all retry attempts are exhausted, the notification is marked as "failed"

## Retry Mechanism

Failed notifications are automatically retried according to the following configuration:
- Maximum retry attempts: 3
- Retry strategy: Exponential backoff
- Initial retry delay: 10 seconds

## Project Structure

```
notification-service/
├── docs/                  # API documentation
├── src/
│   ├── models/            # Database models
│   │   └── notification.js
│   ├── queue/             # Queue configuration
│   │   └── notificationqueue.js
│   ├── routes/            # API routes
│   │   └── notification.js
│   ├── workers/          # Business logic
│   │   └── notificationworkers.js
│   └── app.js            # Application entry point
├── .env                   # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Testing

```bash
npm test
```

## Assumptions

1. Authentication and authorization are not implemented in this demo but should be added in a production environment
2. The notification senders are simulated and should be replaced with actual implementations (e.g., Nodemailer, Twilio)
3. Rate limiting is not implemented but should be considered for production
4. In a real-world scenario, you might want to add more detailed logs and monitoring
5. For a production deployment, consider containerizing the application with Docker

## Future Improvements

- Add user authentication and authorization
- Implement real notification senders (email, SMS providers)
- Add rate limiting
- Add more detailed metrics and monitoring
- Implement webhooks for notification status updates
- Add support for scheduled notifications
- Add support for templates

