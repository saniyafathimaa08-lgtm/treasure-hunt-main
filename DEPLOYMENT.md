# Deployment Guide - Hosting on Internet

## Option 1: Render (Recommended)

### Prerequisites
1. Create a [Render account](https://render.com)
2. Connect your GitHub repository
3. Set up a PostgreSQL database

### Step-by-Step Deployment

#### 1. Database Setup
1. In Render dashboard, create a new **PostgreSQL** database
2. Copy the database URL (it will look like: `postgresql://user:password@host:port/database`)

#### 2. Backend Deployment
1. Create a new **Web Service** in Render
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `iedc-treasure-hunt-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `node server.js`
   - **Plan**: Free

4. Add Environment Variables:
   ```
   DATABASE_URL=your_postgresql_database_url
   PORT=5000
   NODE_ENV=production
   ```

#### 3. Frontend Deployment
1. Create another **Web Service** in Render
2. Configure the service:
   - **Name**: `iedc-treasure-hunt-frontend`
   - **Environment**: `Node`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm start`
   - **Plan**: Free

3. Add Environment Variables:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-service-name.onrender.com
   NODE_ENV=production
   ```

#### 4. Database Migration
1. After backend deployment, run database migration:
   ```bash
   npx prisma migrate deploy
   ```

## Option 2: Railway

### Prerequisites
1. Create a [Railway account](https://railway.app)
2. Connect your GitHub repository

### Deployment Steps
1. Create a new project in Railway
2. Add your GitHub repository
3. Railway will automatically detect the `railway.json` configuration
4. Add environment variables in Railway dashboard
5. Deploy

## Option 3: Netlify + Render (Hybrid)

### Frontend on Netlify
1. Create a [Netlify account](https://netlify.com)
2. Connect your GitHub repository
3. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
4. Add environment variables:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
   ```

### Backend on Render
Follow the backend deployment steps from Option 1.

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@host:port/database
PORT=5000
NODE_ENV=production
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

## Post-Deployment Checklist

- [ ] Database migrations completed
- [ ] Environment variables configured
- [ ] CORS settings updated for production domains
- [ ] SSL certificates active
- [ ] Health checks passing
- [ ] Test registration and login functionality
- [ ] Test game functionality

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL format
   - Check database credentials
   - Ensure database is accessible from deployment platform

2. **CORS Errors**
   - Update CORS configuration in `server.js` to include your frontend domain
   - Add `https://your-frontend-domain.com` to allowed origins

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check for TypeScript errors

4. **API Routes Not Working**
   - Ensure frontend is not configured for static export
   - Verify API routes are properly configured
   - Check environment variables

### Support
- Render: [Documentation](https://render.com/docs)
- Railway: [Documentation](https://docs.railway.app)
- Netlify: [Documentation](https://docs.netlify.com)
