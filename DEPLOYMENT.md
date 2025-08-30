# IEDC Treasure Hunt - Netlify Deployment Guide

## 🚀 Excel Registration Feature Confirmed ✅

The application **already has** Excel registration functionality:

### **Excel Export Features:**
1. **Individual Team Registration**: Creates Excel file for each new team registration
2. **Admin Export**: Full Excel export of all teams with members and selfies
3. **Email Integration**: Sends Excel files via email when SMTP is configured
4. **Frontend Download**: Admin dashboard has Excel download button

### **Excel Export Endpoints:**
- `GET /admin/export` - Full team export
- Registration creates individual Excel files
- Email attachments with Excel files

---

## 📋 Deployment Steps

### **1. Backend Deployment (Required First)**

You need to deploy the backend server first. Options:
- **Railway** (Recommended)
- **Render**
- **Heroku**
- **DigitalOcean App Platform**

### **2. Frontend Deployment on Netlify**

#### **Step 1: Prepare Repository**
```bash
# Ensure all files are committed to Git
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

#### **Step 2: Deploy to Netlify**
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Set build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `out`

#### **Step 3: Environment Variables**
Set these in Netlify dashboard:
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

#### **Step 4: Deploy**
Click "Deploy site"

---

## 🔧 Configuration Files

### **netlify.toml** ✅ Created
- Configures build settings
- Sets up redirects for API routes
- Defines function directory

### **next.config.ts** ✅ Updated
- Static export configuration
- Environment variables
- Image optimization settings

### **Netlify Functions** ✅ Created
- API proxy function
- Handles backend communication

---

## 🌐 Access Points

### **Frontend (Netlify)**
- **Main Site**: `https://your-site.netlify.app`
- **Registration**: `https://your-site.netlify.app/register`
- **Login**: `https://your-site.netlify.app/login`
- **Game**: `https://your-site.netlify.app/game`
- **Dashboard**: `https://your-site.netlify.app/dashboard`
- **Admin**: `https://your-site.netlify.app/dashboard/admin`

### **Backend API**
- **Base URL**: `https://your-backend-url.com`
- **Health Check**: `https://your-backend-url.com/health`
- **Excel Export**: `https://your-backend-url.com/admin/export`

---

## 📊 Excel Features Verification

### **Registration Excel**
- ✅ Creates Excel file for each team
- ✅ Includes team ID, name, members, creation date
- ✅ Email attachment support

### **Admin Excel Export**
- ✅ Full team export with all data
- ✅ Member information
- ✅ Selfie URLs and locations
- ✅ Downloadable via admin dashboard

### **Data Structure**
```excel
| TeamID | TeamName | MemberName | CreatedAt | SelfieURL | SelfieAt | Location |
|--------|----------|------------|-----------|-----------|----------|----------|
| 1      | Team A   | John       | 2024-01-01| /uploads/1| 2024-01-01| Library  |
| 1      | Team A   | Jane       | 2024-01-01| /uploads/2| 2024-01-01| Canteen  |
```

---

## 🛠️ Troubleshooting

### **Common Issues:**
1. **CORS Errors**: Ensure backend allows Netlify domain
2. **API 404**: Check Netlify function configuration
3. **Build Failures**: Verify Node.js version (18+)
4. **Environment Variables**: Double-check backend URL

### **Testing Excel Export:**
1. Register a new team
2. Check admin dashboard
3. Click "Download Excel" button
4. Verify file contains team data

---

## 📞 Support

For deployment issues:
1. Check Netlify build logs
2. Verify environment variables
3. Test backend connectivity
4. Review function logs in Netlify dashboard
