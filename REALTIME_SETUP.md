# 🚀 Real-time Door Management System Setup Guide

## Backend Setup (Node.js)

### 1. Install Dependencies
```bash
cd backend
npm install express ws cors
```

### 2. Start Your Backend Server
```bash
# Development mode with auto-restart
npm run dev

# Or production mode
npm start
```

Your backend will run on:
- **HTTP API**: `http://localhost:3001`
- **WebSocket**: `ws://localhost:3001`

## Frontend Setup (React)

### 1. Install Dependencies (if needed)
```bash
# In your main project directory
npm install
```

### 2. Start Frontend Development Server
```bash
npm run dev
```

Your frontend will run on: `http://localhost:5173`

## 🔗 Integration Complete!

### What's Connected:

1. **Real-time WebSocket Connection**
   - Frontend connects to `ws://localhost:3001`
   - Automatic reconnection if connection drops
   - Fallback to HTTP polling if WebSocket fails

2. **API Integration**
   - All API calls go to `http://localhost:3001/api`
   - CRUD operations for users and doors
   - Real-time door control commands

3. **Live Data Updates**
   - Door status changes in real-time
   - Dashboard statistics update automatically
   - User activities appear instantly
   - Connection status indicator

### 🎯 Features Working:

- ✅ **Real-time Door Status**: See door changes instantly
- ✅ **Live Dashboard Stats**: Statistics update automatically
- ✅ **Door Control**: Send commands via WebSocket or HTTP
- ✅ **Connection Status**: Visual indicator of connection
- ✅ **Auto-reconnection**: Reconnects if connection drops
- ✅ **Polling Fallback**: Works even if WebSocket fails

### 🔧 Backend Endpoints:

**WebSocket Events:**
- `door_status_update` - Real-time door status
- `dashboard_stats` - Live statistics
- `user_activity` - Recent user activities
- `door-control` - Door control commands

**HTTP API:**
- `GET /api/doors/statuses` - Get door statuses
- `GET /api/dashboard/stats` - Get dashboard stats
- `GET /api/activities/recent` - Get recent activities
- `POST /api/door-control` - Control doors

### 🚀 How to Test:

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `npm run dev`
3. **Login as Admin**: `admin@example.com` / `admin`
4. **Watch Real-time Updates**: Data updates automatically
5. **Test Door Control**: Click door control buttons
6. **Check Connection Status**: Look for "Live" indicator

### 🎨 Visual Indicators:

- **🟢 Live (WebSocket)**: Connected via WebSocket
- **🟡 Live (Polling)**: Connected via HTTP polling  
- **🔴 Offline**: No connection
- **🔄 Refresh**: Manual refresh button
- **⏰ Last Update**: Shows when data was last updated

Your Node.js backend is now fully integrated with real-time functionality! 🎉
