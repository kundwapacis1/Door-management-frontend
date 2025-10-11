// backend/server-sqlite.js
// Enhanced backend server with SQLite database support

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const config = require('./config');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// SQLite database connection
const db = new sqlite3.Database(config.database.filename);

// Test database connection
db.on('open', () => {
  console.log('🗄️ Connected to SQLite database');
});

db.on('error', (err) => {
  console.error('❌ SQLite connection error:', err);
});

// Store connected clients
const clients = new Set();

// Database helper functions
const dbHelper = {
  // User operations
  async getUsers() {
    return new Promise((resolve, reject) => {
      db.all('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  async getUser(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT id, name, email, role FROM users WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  async createUser({ name, email, role, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (name, email, role, password) VALUES (?, ?, ?, ?)',
        [name, email, role || 'user', hashedPassword],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, name, email, role: role || 'user' });
        }
      );
    });
  },

  async updateUser(id, { name, email, role, password }) {
    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (role) {
      updates.push('role = ?');
      values.push(role);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      return await this.getUser(id);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    return new Promise((resolve, reject) => {
      const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
      db.run(query, values, function(err) {
        if (err) reject(err);
        else resolve({ id, name, email, role });
      });
    });
  },

  async deleteUser(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve({ success: true });
      });
    });
  },

  async resetUserPassword(id, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      db.run('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [hashedPassword, id], function(err) {
        if (err) reject(err);
        else resolve({ success: true, message: 'Password reset successfully' });
      });
    });
  },

  // Door operations
  async getDoors() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM doors ORDER BY created_at DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  async getDoor(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM doors WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  async createDoor({ name, location, status }) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO doors (name, location, status) VALUES (?, ?, ?)',
        [name, location, status || 'closed'],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, name, location, status: status || 'closed', is_online: true });
        }
      );
    });
  },

  async updateDoor(id, { name, location, status }) {
    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (location) {
      updates.push('location = ?');
      values.push(location);
    }
    if (status) {
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return await this.getDoor(id);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    return new Promise((resolve, reject) => {
      const query = `UPDATE doors SET ${updates.join(', ')} WHERE id = ?`;
      db.run(query, values, function(err) {
        if (err) reject(err);
        else resolve({ id, name, location, status });
      });
    });
  },

  async deleteDoor(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM doors WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve({ success: true });
      });
    });
  },

  async controlDoor(id, action) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE doors SET status = ?, last_update = CURRENT_TIMESTAMP WHERE id = ?',
        [action, id],
        function(err) {
          if (err) reject(err);
          else resolve({ id, status: action });
        }
      );
    });
  },

  async getDoorStatuses() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM doors ORDER BY name', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Dashboard operations
  async getDashboardStats() {
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT 
          (SELECT COUNT(*) FROM users) as total_users,
          (SELECT COUNT(*) FROM doors) as total_doors,
          (SELECT COUNT(*) FROM doors WHERE is_online = 1) as active_doors,
          (SELECT COUNT(*) FROM doors WHERE is_online = 1) as online_doors,
          (SELECT COUNT(*) FROM doors WHERE is_online = 0) as offline_doors,
          (SELECT COUNT(*) FROM activities WHERE timestamp > datetime('now', '-24 hours')) as recent_activity
      `, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // Activity operations
  async getRecentActivities(limit = 10) {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM activities ORDER BY timestamp DESC LIMIT ?',
        [limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  },

  async addActivity({ userId, userName, doorId, doorName, action, method }) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO activities (user_id, user_name, door_id, door_name, action, method) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, userName, doorId, doorName, action, method],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, userId, userName, doorId, doorName, action, method });
        }
      );
    });
  }
};

// WebSocket connection handling
wss.on('connection', async (ws) => {
  console.log('🔗 New WebSocket client connected');
  clients.add(ws);

  try {
    // Send initial data
    const [doorStatuses, dashboardStats, recentActivities] = await Promise.all([
      dbHelper.getDoorStatuses(),
      dbHelper.getDashboardStats(),
      dbHelper.getRecentActivities()
    ]);

    ws.send(JSON.stringify({
      type: 'door_status_update',
      data: doorStatuses
    }));

    ws.send(JSON.stringify({
      type: 'dashboard_stats',
      data: dashboardStats
    }));

    ws.send(JSON.stringify({
      type: 'user_activity',
      data: recentActivities
    }));
  } catch (error) {
    console.error('Error sending initial data:', error);
  }

  // Handle messages from client
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      handleClientMessage(data, ws);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    console.log('🔌 WebSocket client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

// Handle client messages
async function handleClientMessage(data, ws) {
  switch (data.type) {
    case 'command':
      await handleCommand(data.command, data.data, ws);
      break;
    case 'refresh':
      await sendAllData(ws);
      break;
    default:
      console.log('Unknown message type:', data.type);
  }
}

// Handle commands
async function handleCommand(command, data, ws) {
  switch (command) {
    case 'door-control':
      await handleDoorControl(data, ws);
      break;
    case 'refresh':
      await sendAllData(ws);
      break;
    default:
      console.log('Unknown command:', command);
  }
}

// Handle door control
async function handleDoorControl(data, ws) {
  try {
    const { doorId, action } = data;
    const door = await dbHelper.controlDoor(doorId, action);
    
    if (door) {
      // Get updated door statuses
      const doorStatuses = await dbHelper.getDoorStatuses();
      
      // Broadcast update to all clients
      broadcastToAll({
        type: 'door_status_update',
        data: doorStatuses
      });

      // Add activity log
      await dbHelper.addActivity({
        userId: 'admin',
        userName: 'Admin User',
        doorId: doorId,
        doorName: door.name || `Door ${doorId}`,
        action: action === 'open' ? 'entry' : 'exit',
        method: 'admin'
      });

      // Get updated activities
      const recentActivities = await dbHelper.getRecentActivities();
      broadcastToAll({
        type: 'user_activity',
        data: recentActivities
      });

      console.log(`🚪 Door ${doorId} ${action} by admin`);
    }
  } catch (error) {
    console.error('Error handling door control:', error);
  }
}

// Send all data to a specific client
async function sendAllData(ws) {
  try {
    const [doorStatuses, dashboardStats, recentActivities] = await Promise.all([
      dbHelper.getDoorStatuses(),
      dbHelper.getDashboardStats(),
      dbHelper.getRecentActivities()
    ]);

    ws.send(JSON.stringify({
      type: 'door_status_update',
      data: doorStatuses
    }));

    ws.send(JSON.stringify({
      type: 'dashboard_stats',
      data: dashboardStats
    }));

    ws.send(JSON.stringify({
      type: 'user_activity',
      data: recentActivities
    }));
  } catch (error) {
    console.error('Error sending all data:', error);
  }
}

// Broadcast to all connected clients
function broadcastToAll(data) {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Middleware
app.use(cors());
app.use(express.json());

// ===== REST API ENDPOINTS =====

// User CRUD endpoints
app.get('/api/users', async (req, res) => {
  try {
    const users = await dbHelper.getUsers();
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await dbHelper.getUser(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const newUser = await dbHelper.createUser({ name, email, role, password });
    
    // Update dashboard stats
    const dashboardStats = await dbHelper.getDashboardStats();
    broadcastToAll({
      type: 'dashboard_stats',
      data: dashboardStats
    });
    
    res.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const updatedUser = await dbHelper.updateUser(req.params.id, { name, email, role, password });
    
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await dbHelper.deleteUser(req.params.id);
    
    // Update dashboard stats
    const dashboardStats = await dbHelper.getDashboardStats();
    broadcastToAll({
      type: 'dashboard_stats',
      data: dashboardStats
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Password management
app.post('/api/users/:id/reset-password', async (req, res) => {
  try {
    const { password } = req.body;
    const result = await dbHelper.resetUserPassword(req.params.id, password);
    res.json(result);
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Door CRUD endpoints
app.get('/api/doors', async (req, res) => {
  try {
    const doors = await dbHelper.getDoors();
    res.json(doors);
  } catch (error) {
    console.error('Error getting doors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/doors/:id', async (req, res) => {
  try {
    const door = await dbHelper.getDoor(req.params.id);
    if (door) {
      res.json(door);
    } else {
      res.status(404).json({ error: 'Door not found' });
    }
  } catch (error) {
    console.error('Error getting door:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/doors', async (req, res) => {
  try {
    const { name, location, status } = req.body;
    const newDoor = await dbHelper.createDoor({ name, location, status });
    
    // Update dashboard stats
    const dashboardStats = await dbHelper.getDashboardStats();
    broadcastToAll({
      type: 'dashboard_stats',
      data: dashboardStats
    });
    
    res.json(newDoor);
  } catch (error) {
    console.error('Error creating door:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/doors/:id', async (req, res) => {
  try {
    const { name, location, status } = req.body;
    const updatedDoor = await dbHelper.updateDoor(req.params.id, { name, location, status });
    
    if (updatedDoor) {
      // Get updated door statuses
      const doorStatuses = await dbHelper.getDoorStatuses();
      broadcastToAll({
        type: 'door_status_update',
        data: doorStatuses
      });
      
      res.json(updatedDoor);
    } else {
      res.status(404).json({ error: 'Door not found' });
    }
  } catch (error) {
    console.error('Error updating door:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/doors/:id', async (req, res) => {
  try {
    await dbHelper.deleteDoor(req.params.id);
    
    // Update dashboard stats
    const dashboardStats = await dbHelper.getDashboardStats();
    broadcastToAll({
      type: 'dashboard_stats',
      data: dashboardStats
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting door:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Door control endpoints
app.post('/api/doors/:id/control', async (req, res) => {
  try {
    const { action } = req.body;
    const doorId = req.params.id;
    await handleDoorControl({ doorId, action }, null);
    res.json({ success: true });
  } catch (error) {
    console.error('Error controlling door:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/doors/statuses', async (req, res) => {
  try {
    const doorStatuses = await dbHelper.getDoorStatuses();
    res.json(doorStatuses);
  } catch (error) {
    console.error('Error getting door statuses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Dashboard endpoints
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const dashboardStats = await dbHelper.getDashboardStats();
    res.json(dashboardStats);
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Activity endpoints
app.get('/api/activities/recent', async (req, res) => {
  try {
    const recentActivities = await dbHelper.getRecentActivities();
    res.json(recentActivities);
  } catch (error) {
    console.error('Error getting recent activities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Legacy endpoint for compatibility
app.post('/api/door-control', async (req, res) => {
  try {
    const { doorId, action } = req.body;
    await handleDoorControl({ doorId, action }, null);
    res.json({ success: true });
  } catch (error) {
    console.error('Error controlling door:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Simulate real-time updates (for demo purposes)
setInterval(async () => {
  try {
    // Randomly update door statuses
    if (Math.random() > 0.7) {
      const doors = await dbHelper.getDoors();
      const randomDoor = doors[Math.floor(Math.random() * doors.length)];
      
      if (randomDoor && randomDoor.is_online) {
        const actions = ['open', 'closed', 'locked'];
        const oldStatus = randomDoor.status;
        const newStatus = actions[Math.floor(Math.random() * actions.length)];
        
        if (oldStatus !== newStatus) {
          await dbHelper.controlDoor(randomDoor.id, newStatus);
          
          // Add activity log for status change
          await dbHelper.addActivity({
            userId: 'system',
            userName: 'System',
            doorId: randomDoor.id,
            doorName: randomDoor.name,
            action: newStatus === 'open' ? 'entry' : 'exit',
            method: 'system'
          });
          
          // Get updated data
          const [doorStatuses, recentActivities] = await Promise.all([
            dbHelper.getDoorStatuses(),
            dbHelper.getRecentActivities()
          ]);
          
          broadcastToAll({
            type: 'door_status_update',
            data: doorStatuses
          });
          
          broadcastToAll({
            type: 'user_activity',
            data: recentActivities
          });
        }
      }
    }

    // Update dashboard stats
    const dashboardStats = await dbHelper.getDashboardStats();
    broadcastToAll({
      type: 'dashboard_stats',
      data: dashboardStats
    });
  } catch (error) {
    console.error('Error in real-time simulation:', error);
  }
}, 10000); // Update every 10 seconds

// Start server
const PORT = config.server.port;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for connections`);
  console.log(`🌐 HTTP API available at http://localhost:${PORT}`);
  console.log(`🗄️ SQLite database connected`);
});

module.exports = { app, server, wss };
