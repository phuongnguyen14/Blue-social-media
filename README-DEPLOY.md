# 🚀 Quick Deploy to Railway

## 🚀 TÓM TẮT NHANH

1. **Chuẩn bị:**
   ```bash
   npm run railway:setup  # Generate JWT secret & test build
   ```

2. **Railway:**
   - Tạo project từ GitHub repo
   - Add PostgreSQL database
   - Copy environment variables từ step 1
   - Deploy!

3. **Test:**
   ```bash
   curl https://your-app.railway.app/api/v1/auth/profile
   # Expected: {"message":"Unauthorized","statusCode":401} ✅
   ```

## 📚 Chi tiết

Đọc file `RAILWAY_DEPLOY.md` để có hướng dẫn đầy đủ từng bước.

## 🔧 Commands

```bash
# Generate setup info
npm run railway:setup

# Test production build locally  
npm run build
npm run start:prod

# Check logs
# Railway Dashboard → Your service → Logs tab
```

## 🌐 URLs sau khi deploy

- **API**: `https://your-app.railway.app/api/v1`
- **Swagger**: `https://your-app.railway.app/api/docs`
- **Health**: `https://your-app.railway.app/api/v1/auth/profile` 