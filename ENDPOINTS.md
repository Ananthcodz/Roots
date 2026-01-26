# API Endpoints Documentation

**Base URL:** `http://localhost:3000/api`

All endpoints (except auth/register and auth/login) require Bearer token authentication via `Authorization: Bearer {accessToken}` header.

---

## Authentication Endpoints

### 1. Register User
- **Method:** `POST`
- **Endpoint:** `/auth/register`
- **Description:** Register a new user with email and password
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123",
    "fullName": "John Doe"
  }
  ```
- **Response:** User object with tokens
- **Security:** Password is hashed server-side using bcrypt (≥10 salt rounds)

### 2. Login
- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Description:** Login with email and password
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Response:** User object with `accessToken` and `refreshToken`

### 3. Login with Google OAuth
- **Method:** `POST`
- **Endpoint:** `/auth/google`
- **Description:** Authenticate using Google OAuth token
- **Request Body:**
  ```json
  {
    "token": "google_oauth_token"
  }
  ```
- **Response:** User object with tokens

### 5. Logout
- **Method:** `POST`
- **Endpoint:** `/auth/logout`
- **Description:** Logout current user and invalidate session
- **Authentication:** Required
- **Request Body:** Empty object `{}`
- **Response:** Success message

### 6. Request Password Reset
- **Method:** `POST`
- **Endpoint:** `/auth/forgot-password`
- **Description:** Request password reset email
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response:** Confirmation message

### 7. Reset Password
- **Method:** `POST`
- **Endpoint:** `/auth/reset-password`
- **Description:** Reset password using reset token
- **Request Body:**
  ```json
  {
    "token": "reset_token_from_email",
    "newPassword": "newSecurePassword123"
  }
  ```
- **Response:** Success message
- **Security:** New password is hashed server-side

### 8. Refresh Token
- **Method:** `POST`
- **Endpoint:** `/auth/refresh`
- **Description:** Get new access token using refresh token
- **Request Body:**
  ```json
  {
    "refreshToken": "refresh_token_from_storage"
  }
  ```
- **Response:** New `accessToken`

---

## User Profile Endpoints

### 1. Get User Profile
- **Method:** `GET`
- **Endpoint:** `/users/{userId}`
- **Description:** Get user profile by ID
- **Authentication:** Required
- **Response:** User profile object

### 2. Update User Profile
- **Method:** `PUT`
- **Endpoint:** `/users/profile`
- **Description:** Update user profile information
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "fullName": "Jane Doe",
    "bio": "Family enthusiast",
    "location": "New York, NY"
  }
  ```
- **Response:** Updated user profile

### 3. Upload Profile Photo
- **Method:** `POST`
- **Endpoint:** `/users/photo`
- **Description:** Upload and set profile photo (auto-compressed to 800x800px)
- **Authentication:** Required
- **Content-Type:** `multipart/form-data`
- **Request Body:** Form data with `photo` file
- **Response:**
  ```json
  {
    "photoUrl": "https://cdn.example.com/photos/user123.jpg"
  }
  ```

---

## Family Member Endpoints

### 1. Add Family Member
- **Method:** `POST`
- **Endpoint:** `/family/members`
- **Description:** Add a new family member to the tree
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "firstName": "Jane",
    "lastName": "Doe",
    "dateOfBirth": "1990-05-15",
    "gender": "female",
    "relationship": "sister",
    "tag": "Grandmother",
    "photoUrl": "https://cdn.example.com/photos/jane.jpg"
  }
  ```
- **Response:** Created family member object with ID
- **Error Codes:**
  - `400` - Invalid family member data
  - `401` - Authentication required
  - `500` - Server error

### 2. Update Family Member
- **Method:** `PUT`
- **Endpoint:** `/family/members/{memberId}`
- **Description:** Update existing family member information
- **Authentication:** Required
- **Request Body:** Same as Add Family Member (partial updates allowed)
- **Response:** Updated family member object
- **Error Codes:**
  - `400` - Invalid data
  - `401` - Authentication required
  - `404` - Family member not found
  - `500` - Server error

### 3. Get All Family Members
- **Method:** `GET`
- **Endpoint:** `/family/members`
- **Description:** Get all family members for current user's tree
- **Authentication:** Required
- **Response:** Array of family member objects
- **Retry Logic:** 3 retries with exponential backoff (1s, 2s, 4s)

### 4. Search Family Members
- **Method:** `GET`
- **Endpoint:** `/family/members/search`
- **Description:** Search family members by name
- **Authentication:** Required
- **Query Parameters:**
  - `q` (string) - Search query
- **Response:** Array of matching family member objects
- **Retry Logic:** 3 retries with exponential backoff

---

## Relationship Endpoints

### 1. Get All Relationships
- **Method:** `GET`
- **Endpoint:** `/family/relationships`
- **Description:** Get all relationships in the family tree
- **Authentication:** Required
- **Response:** Array of relationship objects
  ```json
  [
    {
      "id": "rel123",
      "parentId": "member1",
      "childId": "member2",
      "type": "parent-child"
    }
  ]
  ```
- **Retry Logic:** 3 retries with exponential backoff

---

## Invitation Endpoints

### 1. Validate Invite Code
- **Method:** `POST`
- **Endpoint:** `/invites/validate`
- **Description:** Validate an invite code format and existence
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "inviteCode": "ABC123"
  }
  ```
- **Response:** Tree information if valid
- **Error Codes:**
  - `404` - Invalid invite code
  - `410` - Invite code expired
  - `409` - Already a member of this tree
  - `401` - Authentication required
  - `500` - Server error

### 2. Join Family Tree
- **Method:** `POST`
- **Endpoint:** `/invites/join`
- **Description:** Join a family tree using an invite code
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "inviteCode": "ABC123"
  }
  ```
- **Response:** Joined tree information
- **Error Codes:** Same as Validate Invite Code
- **Retry Logic:** 3 retries with exponential backoff

### 3. Get Pending Invitations
- **Method:** `GET`
- **Endpoint:** `/invites/pending`
- **Description:** Get all pending invitations for current user
- **Authentication:** Required
- **Response:** Array of pending invitation objects
- **Retry Logic:** 3 retries with exponential backoff

### 4. Accept Invitation
- **Method:** `POST`
- **Endpoint:** `/invites/{invitationId}/accept`
- **Description:** Accept a pending invitation
- **Authentication:** Required
- **Request Body:** Empty object `{}`
- **Response:** Accepted invitation result
- **Error Codes:**
  - `404` - Invitation not found
  - `409` - Invitation already processed
  - `401` - Authentication required
  - `500` - Server error
- **Retry Logic:** 3 retries with exponential backoff

### 5. Decline Invitation
- **Method:** `POST`
- **Endpoint:** `/invites/{invitationId}/decline`
- **Description:** Decline a pending invitation
- **Authentication:** Required
- **Request Body:** Empty object `{}`
- **Response:** Declined invitation result
- **Error Codes:** Same as Accept Invitation
- **Retry Logic:** 3 retries with exponential backoff

---

## Memory & Photo Endpoints

### 1. Upload Photos and Create Memory
- **Method:** `POST`
- **Endpoint:** `/memories/upload`
- **Description:** Upload multiple photos and create a memory
- **Authentication:** Required
- **Content-Type:** `multipart/form-data`
- **Request Body:** Form data with:
  - `photos` (File[]) - Array of photo files (auto-compressed to 1200x1200px)
  - `albumId` (string, optional) - Album ID
  - `location` (string, optional) - Location name
  - `dateTaken` (string, optional) - ISO date string
  - `description` (string, optional) - Memory description
  - `taggedPeople` (JSON string, optional) - Array of tagged family member IDs
- **Response:**
  ```json
  {
    "id": "memory123",
    "photoUrls": ["url1", "url2"],
    "albumId": "album123",
    "location": "New York",
    "dateTaken": "2024-01-15",
    "description": "Family gathering",
    "taggedPeople": ["member1", "member2"],
    "partialFailures": [],
    "hasPartialFailures": false
  }
  ```
- **Error Codes:**
  - `400` - Invalid photo or memory data
  - `401` - Authentication required
  - `413` - File size too large (max 10MB per photo)
  - `500` - Server error
- **Retry Logic:** 3 retries with exponential backoff
- **Progress Tracking:** `onUploadProgress` callback available

### 2. Create Memory (without photos)
- **Method:** `POST`
- **Endpoint:** `/memories`
- **Description:** Create a memory with existing photo URLs
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "photoUrls": ["url1", "url2"],
    "albumId": "album123",
    "location": "New York",
    "dateTaken": "2024-01-15",
    "description": "Family gathering",
    "taggedPeople": ["member1", "member2"]
  }
  ```
- **Response:** Created memory object
- **Error Codes:**
  - `400` - Invalid memory data
  - `401` - Authentication required
  - `500` - Server error
- **Retry Logic:** 3 retries with exponential backoff

### 3. Get All Albums
- **Method:** `GET`
- **Endpoint:** `/albums`
- **Description:** Get all albums for current user
- **Authentication:** Required
- **Response:** Array of album objects
- **Retry Logic:** 3 retries with exponential backoff

---

## Error Handling

All endpoints follow consistent error handling:

- **Validation Errors (400):**
  ```json
  {
    "message": "Invalid family member data",
    "errors": {
      "firstName": "First name is required",
      "dateOfBirth": "Invalid date format"
    }
  }
  ```

- **Authentication Errors (401):**
  ```json
  {
    "message": "Authentication required"
  }
  ```

- **Not Found Errors (404):**
  ```json
  {
    "message": "Resource not found"
  }
  ```

- **Server Errors (500+):**
  ```json
  {
    "message": "Server error. Please try again later."
  }
  ```

---

## Retry Logic

Services implement exponential backoff retry logic for network resilience:
- **Max Retries:** 3 attempts
- **Backoff Strategy:** 1s → 2s → 4s delays
- **Retry Conditions:**
  - Network errors (no response)
  - 5xx server errors (500-599)
- **No Retry For:**
  - 4xx client errors (400-499)
  - Successful responses (2xx)

---

## Authentication Flow

1. User registers or logs in → receives `accessToken` and `refreshToken`
2. Store tokens in `localStorage`
3. Include `Authorization: Bearer {accessToken}` in all authenticated requests
4. When token expires, use `refreshToken` to get new `accessToken`
5. On logout, tokens are invalidated server-side

---

## Rate Limiting

Currently no rate limiting implemented. Consider adding for production:
- Suggested: 100 requests per minute per user
- Implement token bucket or sliding window algorithm

---

## CORS Configuration

Ensure backend CORS settings allow:
- Origin: Frontend URL (e.g., `http://localhost:5173`)
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: Content-Type, Authorization
- Credentials: Include

---

## Environment Configuration

Set `VITE_API_BASE_URL` in `.env` file:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

Default fallback: `http://localhost:3000/api`

---

## Mock Mode

When `VITE_MOCK_API=true` in `.env`, the app uses mock data instead of real API calls. Useful for development without backend server.
