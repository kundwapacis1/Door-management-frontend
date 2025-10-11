# Door Management Backend with PostgreSQL

This backend server provides REST API endpoints and WebSocket support for real-time door management functionality.

## Features

- **PostgreSQL Database**: Persistent data storage with proper schema
- **REST API**: CRUD operations for users and doors
- **WebSocket**: Real-time updates for dashboard and door control
- **Password Management**: Secure password hashing with bcrypt
- **Activity Logging**: Track all door access activities
- **Dashboard Statistics**: Real-time stats and analytics

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Setup PostgreSQL Database**
   ```bash
   # Create database (as postgres user)
   createdb door_management
   
   # Run setup script
   psql -U postgres -d door_management -f setup_database.sql
   ```

3. **Configure Database Connection**
   Update the database connection settings in `config.js`:
   ```javascript
   database: {
     host: 'localhost',
     port: 5432,
     database: 'door_management',
     user: 'postgres',
     password: 'your_password'
   }
   ```

4. **Start the Server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Database Schema

### Users Table
- `id`: Primary key (auto-increment)
- `name`: User's full name
- `email`: Unique email address
- `role`: User role (admin/user)
- `password`: Hashed password
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Doors Table
- `id`: Primary key (auto-increment)
- `name`: Door name
- `location`: Door location
- `status`: Current status (open/closed/locked)
- `is_online`: Online status
- `last_update`: Last status update
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Activities Table
- `id`: Primary key (auto-increment)
- `user_id`: User identifier
- `user_name`: User's name
- `door_id`: Reference to door
- `door_name`: Door name
- `action`: Action performed (entry/exit/denied)
- `method`: Access method (pin/rfid/fingerprint/admin/system)
- `timestamp`: Activity timestamp
- `created_at`: Creation timestamp

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/reset-password` - Reset user password

### Doors
- `GET /api/doors` - Get all doors
- `GET /api/doors/:id` - Get door by ID
- `POST /api/doors` - Create new door
- `PUT /api/doors/:id` - Update door
- `DELETE /api/doors/:id` - Delete door
- `POST /api/doors/:id/control` - Control door (open/close/lock/unlock)
- `GET /api/doors/statuses` - Get all door statuses

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/activities/recent` - Get recent activities

## WebSocket Events

### Client to Server
- `command`: Send command to server
- `refresh`: Request data refresh

### Server to Client
- `door_status_update`: Door status changes
- `dashboard_stats`: Dashboard statistics update
- `user_activity`: New activity logs

## Environment Variables

Create a `.env` file in the backend directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=door_management
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3001
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
BCRYPT_ROUNDS=10
```

## Security Features

- **Password Hashing**: Uses bcrypt for secure password storage
- **Input Validation**: Validates all input data
- **SQL Injection Protection**: Uses parameterized queries
- **CORS**: Configured for frontend communication

## Real-time Features

- **Live Updates**: Door status changes broadcast to all clients
- **Activity Logging**: All activities logged in real-time
- **Dashboard Stats**: Statistics updated automatically
- **Connection Management**: Handles client connections and disconnections

## Development

### Running in Development Mode
```bash
npm run dev
```

### Database Migrations
To add new tables or modify existing ones, update `setup_database.sql` and run:
```bash
psql -U postgres -d door_management -f setup_database.sql
```

### Testing
```bash
# Test database connection
node -e "require('./server.js')"

# Test API endpoints
curl http://localhost:3001/api/users
```

## Production Deployment

1. **Set Environment Variables**
   ```bash
   export NODE_ENV=production
   export DB_PASSWORD=secure_password
   export JWT_SECRET=secure_jwt_secret
   ```

2. **Start Server**
   ```bash
   npm start
   ```

3. **Use Process Manager** (recommended)
   ```bash
   npm install -g pm2
   pm2 start server.js --name "door-management-backend"
   ```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify connection credentials
   - Ensure database exists

2. **WebSocket Connection Failed**
   - Check firewall settings
   - Verify port 3001 is open
   - Check client WebSocket URL

3. **Permission Denied**
   - Check PostgreSQL user permissions
   - Verify database ownership

### Logs
Check server logs for detailed error information:
```bash
# Development
npm run dev

# Production
pm2 logs door-management-backend
```

## Support

For issues or questions:
1. Check the logs for error messages
2. Verify database connection
3. Test API endpoints individually
4. Check WebSocket connection status
