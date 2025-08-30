# Backend Deployment Guide

## 🚀 Quick Deploy Options

### **Option 1: Railway (Recommended)**
1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Set environment variables:
   ```
   DATABASE_URL=file:./dev.db
   PORT=5000
   ```
4. Deploy

### **Option 2: Render**
1. Go to [Render](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Set build command: `npm install && npx prisma generate`
5. Set start command: `node server.js`
6. Add environment variables:
   ```
   DATABASE_URL=file:./dev.db
   PORT=5000
   ```

### **Option 3: Heroku**
1. Install Heroku CLI
2. Create app: `heroku create your-app-name`
3. Add buildpack: `heroku buildpacks:add heroku/nodejs`
4. Set environment variables:
   ```bash
   heroku config:set DATABASE_URL=file:./dev.db
   heroku config:set PORT=5000
   ```
5. Deploy: `git push heroku main`

## 🔧 Environment Variables

### **Required:**
```
DATABASE_URL=file:./dev.db
PORT=5000
```

### **Optional (for email features):**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
MAIL_TO=admin@example.com
MAIL_FROM=your-email@gmail.com
EXPORT_INTERVAL_MINUTES=60
```

## 📊 Database Setup

The app uses SQLite with Prisma. The database will be automatically created and seeded on first run.

### **Manual Database Setup (if needed):**
```bash
npx prisma generate
npx prisma db push
```

## 🌐 CORS Configuration

Update the CORS settings in `server.js` to allow your Netlify domain:

```javascript
app.use(cors({
  origin: ['https://your-site.netlify.app', 'http://localhost:3000'],
  credentials: true
}));
```

## ✅ Health Check

After deployment, test the backend:
```
GET https://your-backend-url.com/health
```

Should return: `{"status":"ok"}`

## 🔗 Update Frontend

Once backend is deployed, update the frontend environment variable:
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
```
