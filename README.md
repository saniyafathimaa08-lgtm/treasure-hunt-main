# IEDC Treasure Hunt 🎯

A gamified treasure hunt application for college campuses, featuring QR code scanning, riddle solving, and team-based gameplay.

## ✨ Features

### 🎮 Game Mechanics
- **5 Random Locations** + **1 Final Location** per team
- **QR Code Verification** at each location
- **Selfie Upload** to progress
- **Deterministic Riddle Assignment** (prevents cheating)
- **Unique Path Generation** for each team

### 📊 Excel Registration System ✅
- **Individual Team Excel** - Created for each registration
- **Admin Excel Export** - Full team data with members and selfies
- **Email Integration** - Automatic Excel file attachments
- **Download Button** - Admin dashboard Excel download

### 🏗️ Technical Stack
- **Backend**: Node.js + Express + Prisma + SQLite
- **Frontend**: Next.js 15 + React 19 + Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **File Upload**: Multer for selfie storage
- **Excel**: XLSX library for data export

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development
```bash
# Clone repository
git clone <repository-url>
cd iedc-treasure-hunt

# Install dependencies
npm install
cd frontend && npm install

# Start backend (from root)
npm start

# Start frontend (from frontend directory)
cd frontend
npm run dev
```

### Environment Variables
Create `.env` file in root:
```env
DATABASE_URL=file:./dev.db
PORT=5000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

## 🌐 Deployment

### Backend Deployment
See [BACKEND_DEPLOYMENT.md](./BACKEND_DEPLOYMENT.md) for detailed instructions.

**Recommended**: Railway, Render, or Heroku

### Frontend Deployment (Netlify)
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Steps**:
1. Deploy backend first
2. Connect GitHub repo to Netlify
3. Set environment variables
4. Deploy

## 📊 Excel Features

### Registration Excel
- ✅ Team ID, Name, Creation Date
- ✅ Member Names
- ✅ Email attachment support

### Admin Excel Export
- ✅ All teams with complete data
- ✅ Member information
- ✅ Selfie URLs and locations
- ✅ Downloadable via admin dashboard

### Data Structure
```excel
| TeamID | TeamName | MemberName | CreatedAt | SelfieURL | SelfieAt | Location |
|--------|----------|------------|-----------|-----------|----------|----------|
| 1      | Team A   | John       | 2024-01-01| /uploads/1| 2024-01-01| Library  |
| 1      | Team A   | Jane       | 2024-01-01| /uploads/2| 2024-01-01| Canteen  |
```

## 🎯 Game Locations

### 19 Non-Final Locations
- Library, Visweswaraya Hall, Lift, Bus Parking
- Reception, Stationary Store, CSE Lab, College Name Board
- Pharmacy Entrance, Water Dispenser, Pharmacy Canteen
- Coffee Day Cafe, Notice Board, Staircase
- Principal Room, Staff Room, Bridge, IEDC Room, Car Parking

### 1 Final Location
- **NODAL OFFICER (IEDC ASET)** - The ultimate destination

## 🔧 API Endpoints

### Game Endpoints
- `POST /register` - Team registration
- `POST /login` - Team authentication
- `POST /game/:teamId/spin` - Generate unique path
- `GET /game/:teamId/clue` - Get current riddle
- `POST /game/:teamId/verify-qr` - Verify QR code
- `POST /game/:teamId/verify-selfie` - Upload selfie & advance

### Admin Endpoints
- `GET /admin/export` - Excel export of all teams
- `POST /admin/cleanup-finals` - Fix multiple final locations
- `GET /admin/locations` - List all locations
- `POST /admin/riddles/bulk` - Bulk update riddles

## 🐛 Recent Fixes

### Multiple Final Locations Bug ✅
- **Issue**: Teams were getting 7+ locations instead of 6
- **Cause**: Multiple locations marked as `isFinal: true`
- **Fix**: Path generation now uses only first final location
- **Added**: Automatic cleanup function on server startup

## 📱 Frontend Pages

- **Landing** (`/`) - Animated fantasy homepage
- **Registration** (`/register`) - Team creation
- **Login** (`/login`) - Authentication
- **Dashboard** (`/dashboard`) - Progress overview
- **Game** (`/game`) - Main gameplay interface
- **Admin** (`/dashboard/admin`) - Admin panel

## 🎨 UI Features

- **Fantasy Theme** - Animated backgrounds and effects
- **Responsive Design** - Mobile-optimized interface
- **QR Scanner** - Browser-based camera integration
- **File Upload** - Selfie capture and storage
- **Progress Tracking** - Real-time game state

## 🔒 Security Features

- **Password Hashing** - bcrypt encryption
- **File Upload Limits** - 5MB max file size
- **Unique Team Names** - Prevents duplicates
- **Deterministic Riddles** - Fair gameplay

## 📞 Support

For issues or questions:
1. Check deployment guides
2. Review server logs
3. Test API endpoints
4. Verify environment variables

## 👨‍💻 Creator

**Midhun M** - IEDC ASET Tech Lead
- Instagram: [@sp.nxa](https://instagram.com/sp.nxa)

---

**Built with ❤️ for IEDC ASET Treasure Hunt**
