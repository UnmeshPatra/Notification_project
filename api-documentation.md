# Notification Service API Documentation

This documentation provides details about the Notification Service API endpoints.

## Send a Notification

Sends a notification to a specific user.

**URL**: `/notifications`

**Method**: `POST`

**Auth required**: No (for demo purposes, should be protected in production)

**Data constraints**:

```json
{
  "userId": "[valid user ID]",
  "type": "[one of: email, sms, in-app]",
  "message": "[notification message]"
}
```

**Data example**:

```json
{
  "userId": "123",
  "type": "email",
  "message": "Your account has been created successfully!"
}
```

### Success Response

**Code**: `201 Created`

**Content example**:

```json
{
  "success": true,
  "notification": {
    "_id": "60d21b4667d0d8992e610c85",
    "userId": "123",
    "type": "email",
    "message": "Your account has been created successfully!",
    "status": "queued",
    "timestamp": "2023-06-22T10:00:00.000Z"
  }
}
```

### Error Responses

**Condition**: If any of the required fields are missing or invalid.

**Code**: `400 Bad Request`

**Content example**:

```json
{
  "error": "Valid notification type is required (email, sms, or in-app)"
}
```

**Condition**: If there is a server error.

**Code**: `500 Internal Server Error`

**Content example**:

```json
{
  "error": "Failed to queue notification",
  "message": "Error details here"
}
```

## Get User Notifications

Retrieves all notifications for a specific user.

**URL**: `/users/:id/notifications`

**Method**: `GET`

**Auth required**: No (for demo purposes, should be protected in production)

**URL Parameters**: `id=[string]` where `id` is the user ID

### Success Response

**Code**: `200 OK`

**Content example**:

```json
{
  "notifications": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "userId": "123",
      "type": "email",
      "message": "Your account has been created successfully!",
      "status": "sent",
      "timestamp": "2023-06-22T10:00:00.000Z"
    },
    {
      "_id": "60d21b4667d0d8992e610c86",
      "userId": "123",
      "type": "sms",
      "message": "Your password has been reset.",
      "status": "sent",
      "timestamp": "2023-06-22T11:00:00.000Z"
    }
  ]
}
```

### Error Responses

**Condition**: If there is a server error.

**Code**: `500 Internal Server Error`

**Content example**:

```json
{
  "error": "Failed to fetch notifications",
  "message": "Error details here"
}
```

## Get Notification by ID

Retrieves a specific notification by its ID.

**URL**: `/notifications/:id`

**Method**: `GET`

**Auth required**: No (for demo purposes, should be protected in production)

**URL Parameters**: `id=[string]` where `id` is the notification ID

### Success Response

**Code**: `200 OK`

**Content example**:

```json
{
  "notification": {
    "_id": "60d21b4667d0d8992e610c85",
    "userId": "123",
    "type": "email",
    "message": "Your account has been created successfully!",
    "status": "sent",
    "timestamp": "2023-06-22T10:00:00.000Z"
  }
}
```

### Error Responses

**Condition**: If the notification is not found.

**Code**: `404 Not Found`

**Content example**:

```json
{
  "error": "Notification not found"
}
```

**Condition**: If there is a server error.

**Code**: `500 Internal Server Error`

**Content example**:

```json
{
  "error": "Failed to fetch notification",
  "message": "Error details here"
}
```