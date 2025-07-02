# 📊 BACKEND API OVERVIEW

## 🌐 BASE URL
```
Production: https://blue-social-media-production.up.railway.app/api/v1
Local:      http://localhost:3000/api/v1
```

## 🎯 GLOBAL CONFIGURATION
- **API Prefix:** `/api/v1` (defined in `src/main.ts`)
- **CORS:** Enabled for all origins
- **Authentication:** JWT Bearer Token
- **Documentation:** `/api/docs` (Swagger)

## 📋 API ENDPOINTS OVERVIEW

### 🏠 ROOT ENDPOINT
```
GET  /api/v1/                    - Hello World message
```

### 🔐 AUTHENTICATION (`/auth`)
```
POST /api/v1/auth/register       - Đăng ký tài khoản mới
POST /api/v1/auth/login          - Đăng nhập
GET  /api/v1/auth/profile        - Lấy thông tin profile (requires auth)
POST /api/v1/auth/change-password - Đổi mật khẩu (requires auth)
```

### 👥 USERS (`/users`)
```
GET  /api/v1/users/search        - Tìm kiếm người dùng
GET  /api/v1/users/:id           - Lấy thông tin user theo ID
GET  /api/v1/users/username/:username - Lấy thông tin user theo username
PUT  /api/v1/users/profile       - Cập nhật profile (requires auth)
POST /api/v1/users/:id/follow    - Follow user (requires auth)
DEL  /api/v1/users/:id/follow    - Unfollow user (requires auth)
GET  /api/v1/users/:id/followers - Lấy danh sách followers
GET  /api/v1/users/:id/following - Lấy danh sách following
```

### 🎬 VIDEOS (`/videos`)
```
GET  /api/v1/videos              - Lấy danh sách videos
GET  /api/v1/videos/trending     - Lấy videos trending
GET  /api/v1/videos/recommended  - Lấy videos đề xuất (requires auth)
GET  /api/v1/videos/:id          - Lấy thông tin video theo ID
POST /api/v1/videos              - Tạo video mới (requires auth)
PUT  /api/v1/videos/:id          - Cập nhật video (requires auth)
DEL  /api/v1/videos/:id          - Xóa video (requires auth)
POST /api/v1/videos/:id/like     - Like/Unlike video (requires auth)
```

### 💬 COMMENTS (`/videos/:videoId/comments`)
```
GET  /api/v1/videos/:videoId/comments            - Lấy comments của video
POST /api/v1/videos/:videoId/comments            - Tạo comment mới (requires auth)
PUT  /api/v1/videos/:videoId/comments/:commentId - Cập nhật comment (requires auth)
DEL  /api/v1/videos/:videoId/comments/:commentId - Xóa comment (requires auth)
POST /api/v1/videos/:videoId/comments/:commentId/like - Like/Unlike comment (requires auth)
```

## 🔑 AUTHENTICATION HEADER
```javascript
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 📱 COMMON RESPONSE FORMATS

### Success Response:
```json
{
  "user": { "id": 1, "username": "test", "email": "test@example.com" },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Error Response:
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## 🎯 QUERY PARAMETERS

### Pagination:
```
?page=1&limit=20
```

### Search:
```
?search=keyword
```

### Sort:
```
?sortBy=createdAt&sortOrder=DESC
```

## 🧪 TEST ENDPOINTS

### Test Authentication:
```bash
curl "https://blue-social-media-production.up.railway.app/api/v1/auth/profile"
# Expected: {"statusCode":401,"message":"Unauthorized"}
```

### Test Root:
```bash
curl "https://blue-social-media-production.up.railway.app/api/v1/"
# Expected: "Hello World!"
```

### Test Register:
```bash
curl -X POST "https://blue-social-media-production.up.railway.app/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"test","password":"password123"}'
```

## 📚 DOCUMENTATION
- **Swagger UI:** `/api/docs`
- **Full URL:** `https://blue-social-media-production.up.railway.app/api/docs`

## 🔧 CONTROLLERS LOCATION
```
Backend/src/controllers/
├── app.controller.ts        - Root endpoint
├── auth.controller.ts       - Authentication
├── users.controller.ts      - User management
├── videos.controller.ts     - Video operations
└── comments.controller.ts   - Comment system
```

---

🎯 **Total: 22 API endpoints** across 4 main resource categories 