import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRealtimeData } from '../hooks/useRealtimeData';
import Header from '../component/Header';
import {
  getUsers,
  createUser,
  updateUser, 
  deleteUser, 
  getDoors, 
  createDoor, 
  updateDoor, 
  deleteDoor,
  controlDoor,
  getDoorStatuses,
  getDashboardStats
} from '../api';
 

type DashboardView = 'overview' | 'users' | 'doors' | 'door-control' | 'logs';

const AdDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  
  // Real-time data hook
  const {
    doorStatuses,
    userActivities,
    dashboardStats,
    lastUpdate,
    isConnected,
    connectionType,
    sendCommand,
    refresh
  } = useRealtimeData('ws://localhost:3001'); // Your Node.js backend WebSocket URL
  
  // Data states
  const [users, setUsers] = useState<Array<{id: string, name: string, email: string, role: string}>>([]);
  const [doors, setDoors] = useState<Array<{id: string, name: string, location: string, status: string, isOnline: boolean}>>([]);
  const [stats, setStats] = useState<{totalUsers: number, totalDoors: number, activeDoors: number, recentActivity: number} | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'user' as 'admin' | 'user', password: '' });
  const [doorForm, setDoorForm] = useState({ name: '', location: '', status: 'closed' as 'open' | 'closed' });
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editingDoor, setEditingDoor] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Password generation function
  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setUserForm({ ...userForm, password });
  };

  // Copy password to clipboard
  const copyPassword = async () => {
    if (userForm.password) {
      try {
        await navigator.clipboard.writeText(userForm.password);
        alert('Password copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy password:', err);
      }
    }
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      switch (currentView) {
        case 'overview':
          await Promise.all([loadStats(), loadDoorStatuses()]);
          break;
        case 'users':
          await loadUsers();
          break;
        case 'doors':
          await loadDoors();
          break;
        case 'door-control':
          await loadDoorStatuses();
          break;
         
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentView]);

  // Load data based on current view
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentView === 'overview' || currentView === 'door-control') {
        loadDoorStatuses();
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [currentView]);

  const loadStats = async () => {
    try {
      const statsData = await getDashboardStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadDoors = async () => {
    try {
      const doorsData = await getDoors();
      setDoors(doorsData);
    } catch (error) {
      console.error('Failed to load doors:', error);
    }
  };

  const loadDoorStatuses = async () => {
    try {
      const doorStatuses = await getDoorStatuses();
      setDoors(doorStatuses);
    } catch (error) {
      console.error('Failed to load door statuses:', error);
    }
  };

  // User CRUD operations
  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser, userForm);
        setUsers(users.map((u: {id: string, name: string, email: string, role: string}) => u.id === editingUser ? { ...u, ...userForm } : u));
        setEditingUser(null);
      } else {
        const newUser = await createUser(userForm);
        setUsers([...users, newUser]);
      }
      setUserForm({ name: '', email: '', role: 'user', password: '' });
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  const handleUserDelete = async (id: string) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((u: {id: string, name: string, email: string, role: string}) => u.id !== id));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  // Door CRUD operations
  const handleDoorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDoor) {
        await updateDoor(editingDoor, doorForm);
        setDoors(doors.map((d: {id: string, name: string, location: string, status: string, isOnline: boolean}) => d.id === editingDoor ? { ...d, ...doorForm } : d));
        setEditingDoor(null);
      } else {
        const newDoor = await createDoor(doorForm);
        setDoors([...doors, newDoor]);
      }
      setDoorForm({ name: '', location: '', status: 'closed' });
    } catch (error) {
      console.error('Failed to save door:', error);
    }
  };

  const handleDoorDelete = async (id: string) => {
    try {
      await deleteDoor(id);
      setDoors(doors.filter((d: {id: string, name: string, location: string, status: string, isOnline: boolean}) => d.id !== id));
    } catch (error) {
      console.error('Failed to delete door:', error);
    }
  };

  // Door control operations
  const handleDoorControl = async (doorId: string, action: 'open' | 'close' | 'lock' | 'unlock') => {
    try {
      // Send command via real-time service
      sendCommand('door-control', { doorId, action });
      
      // Also send via traditional API as fallback
      await controlDoor(doorId, action);
    } catch (error) {
      console.error('Failed to control door:', error);
    }
  };

  const renderOverview = () => (
    <div>
      <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 32 }}>Dashboard Overview</h2>
      
      {(dashboardStats || stats) && (
        <div style={{ display: 'flex', gap: 60, marginBottom: 40 }}>
          <div style={{ background: '#ffffff', padding: 24, borderRadius: 12, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', minWidth: 200 }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>Total Users</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{(dashboardStats || stats)?.totalUsers || 0}</div>
          </div>
          <div style={{ background: '#ffffff', padding: 24, borderRadius: 12, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', minWidth: 200 }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>Total Doors</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{(dashboardStats || stats)?.totalDoors || 0}</div>
          </div>
          <div style={{ background: '#ffffff', padding: 24, borderRadius: 12, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', minWidth: 200 }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>Active Doors</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{(dashboardStats || stats)?.activeDoors || 0}</div>
          </div>
          <div style={{ background: '#ffffff', padding: 24, borderRadius: 12, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', minWidth: 200 }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>Recent Activity</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{(dashboardStats || stats)?.recentActivity || 0}</div>
          </div>
        </div>
      )}

      <div style={{ background: '#ffffff', padding: 24, borderRadius: 12, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ fontSize: 24, marginBottom: 16 }}>Door Status Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {(doorStatuses.length > 0 ? doorStatuses : doors).map((door: {id: string, name: string, location: string, status: string, isOnline: boolean, lastUpdate?: string}) => (
            <div key={door.id} style={{ 
              background: '#f9fafb', 
              padding: 16, 
              borderRadius: 8,
              border: door.isOnline ? '1px solid #10b981' : '1px solid #ef4444'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#1f2937' }}>{door.name}</div>
                  <div style={{ fontSize: 14, color: '#6b7280' }}>{door.location}</div>
                </div>
                <div style={{ 
                  padding: '4px 8px', 
                  borderRadius: 4, 
                  fontSize: 12,
                  background: door.isOnline ? '#10b981' : '#ef4444',
                  color: 'white'
                }}>
                  {door.isOnline ? 'Online' : 'Offline'}
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 14, color: '#1f2937' }}>
                Status: <span style={{ 
                  color: door.status === 'open' ? '#10b981' : 
                         door.status === 'closed' ? '#6b7280' : '#f59e0b'
                }}>{door.status.toUpperCase()}</span>
              </div>
              {door.lastUpdate && (
                <div style={{ marginTop: 4, fontSize: 12, color: '#9ca3af' }}>
                  Last update: {new Date(door.lastUpdate).toLocaleTimeString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      {userActivities.length > 0 && (
        <div style={{ background: '#ffffff', padding: 24, borderRadius: 12, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginTop: 24 }}>
          <h3 style={{ fontSize: 24, marginBottom: 16 }}>Recent Activities</h3>
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {userActivities.map((activity: {id: string, userName: string, action: string, method: string, doorName: string, timestamp: string}) => (
              <div key={activity.id} style={{ 
                padding: '12px 0', 
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 500, color: '#1f2937' }}>
                    {activity.userName} - {activity.action} via {activity.method}
                  </div>
                  <div style={{ fontSize: 14, color: '#6b7280' }}>
                    {activity.doorName} • {new Date(activity.timestamp).toLocaleString()}
                  </div>
                </div>
                <div style={{
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 12,
                  background: activity.action === 'entry' ? '#10b981' : 
                            activity.action === 'exit' ? '#3b82f6' : '#ef4444',
                  color: 'white'
                }}>
                  {activity.action.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div>
      <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 32 }}>User Management</h2>
      
      {/* User Form */}
      <div style={{ background: '#ffffff', padding: 24, borderRadius: 12, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: 32 }}>
        <h3 style={{ fontSize: 24, marginBottom: 16 }}>
          {editingUser ? 'Edit User' : 'Add New User'}
        </h3>
        <form onSubmit={handleUserSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 16, alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>Name</label>
              <input
                type="text"
                value={userForm.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserForm({ ...userForm, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  color: '#1f2937'
                }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>Email</label>
              <input
                type="email"
                value={userForm.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserForm({ ...userForm, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  color: '#1f2937'
                }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={userForm.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserForm({ ...userForm, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    paddingRight: '80px',
                    background: '#ffffff',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    color: '#1f2937'
                  }}
                  placeholder={editingUser ? 'Leave empty to keep current' : 'Enter password'}
                  required={!editingUser}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>Role</label>
              <select
                value={userForm.role}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setUserForm({ ...userForm, role: e.target.value as 'admin' | 'user' })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  color: '#1f2937'
                }}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                type="button"
                onClick={generatePassword}
                style={{
                  padding: '8px 12px',
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '12px',
                  whiteSpace: 'nowrap'
                }}
              >
                Generate
              </button>
              {userForm.password && (
                <button
                  type="button"
                  onClick={copyPassword}
                  style={{
                    padding: '8px 12px',
                    background: '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Copy
                </button>
              )}
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                background: '#f59e0b',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer'
              }}
            >
              {editingUser ? 'Update' : 'Add'} User
            </button>
          </div>
        </form>
      </div>

      {/* Users List */}
      <div style={{ background: '#ffffff', padding: 24, borderRadius: 12, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ fontSize: 24, marginBottom: 16 }}>Users List</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #374151' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: {id: string, name: string, email: string, role: string}) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #374151' }}>
                  <td style={{ padding: '12px' }}>{user.name}</td>
                  <td style={{ padding: '12px' }}>{user.email}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      background: user.role === 'admin' ? '#f59e0b' : '#6b7280',
                      color: 'white'
                    }}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => {
                        setUserForm({ name: user.name, email: user.email, role: user.role as 'admin' | 'user', password: '' });
                        setEditingUser(user.id);
                      }}
                      style={{
                        padding: '4px 8px',
                        background: '#f59e0b',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        marginRight: 8
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        const newPassword = generatePassword();
                        if (confirm(`Reset password for ${user.name}? New password: ${newPassword}`)) {
                          // In a real app, you would call resetUserPassword API here
                          alert(`Password reset for ${user.name}. New password: ${newPassword}`);
                        }
                      }}
                      style={{
                        padding: '4px 8px',
                        background: '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        marginRight: 8
                      }}
                    >
                      Reset Password
                    </button>
                    <button
                      onClick={() => handleUserDelete(user.id)}
                      style={{
                        padding: '4px 8px',
                        background: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDoors = () => (
    <div>
      <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 32 }}>Door Management</h2>
      
      {/* Door Form */}
      <div style={{ background: '#ffffff', padding: 24, borderRadius: 12, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: 32 }}>
        <h3 style={{ fontSize: 24, marginBottom: 16 }}>
          {editingDoor ? 'Edit Door' : 'Add New Door'}
        </h3>
        <form onSubmit={handleDoorSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 16, alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>Door Name</label>
              <input
                type="text"
                value={doorForm.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDoorForm({ ...doorForm, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  color: '#1f2937'
                }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>Location</label>
              <input
                type="text"
                value={doorForm.location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDoorForm({ ...doorForm, location: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  color: '#1f2937'
                }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>Status</label>
              <select
                value={doorForm.status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDoorForm({ ...doorForm, status: e.target.value as 'open' | 'closed' })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  color: '#1f2937'
                }}
              >
                <option value="closed">Closed</option>
                <option value="open">Open</option>
              </select>
            </div>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                background: '#f59e0b',
                color: '#1f2937',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer'
              }}
            >
              {editingDoor ? 'Update' : 'Add'} Door
            </button>
          </div>
        </form>
      </div>

      {/* Doors List */}
      <div style={{ background: '#ffffff', padding: 24, borderRadius: 12, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ fontSize: 24, marginBottom: 16 }}>Doors List</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #374151' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Location</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Online</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doors.map((door: {id: string, name: string, location: string, status: string, isOnline: boolean}) => (
                <tr key={door.id} style={{ borderBottom: '1px solid #374151' }}>
                  <td style={{ padding: '12px' }}>{door.name}</td>
                  <td style={{ padding: '12px' }}>{door.location}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      background: door.status === 'open' ? '#10b981' : '#6b7280',
                      color: 'white'
                    }}>
                      {door.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      background: door.isOnline ? '#10b981' : '#ef4444',
                      color: 'white'
                    }}>
                      {door.isOnline ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => {
                        setDoorForm({ name: door.name, location: door.location, status: door.status as 'open' | 'closed' });
                        setEditingDoor(door.id);
                      }}
                      style={{
                        padding: '4px 8px',
                        background: '#f59e0b',
                        color: '#1f2937',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        marginRight: 8
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDoorDelete(door.id)}
                      style={{
                        padding: '4px 8px',
                        background: '#ef4444',
                        color: '#1f2937',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDoorControl = () => (
    <div>
      <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 32 }}>Door Control</h2>
      <div style={{ 
        background: '#ffffff', 
        padding: 24, 
        borderRadius: 12,
        marginBottom: 16
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 16
        }}>
          <h3 style={{ fontSize: 24 }}>Real-time Door Control</h3>
          <div style={{ 
            padding: '4px 8px', 
            background: '#10b981', 
            borderRadius: 4,
            fontSize: 12,
            color: 'white'
          }}>
            Live Updates
          </div>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: 20 
        }}>
          {doors.map((door: {id: string, name: string, location: string, status: string, isOnline: boolean}) => (
            <div key={door.id} style={{ 
              background: '#ffffff', 
              padding: 20, 
              borderRadius: 12,
              border: door.isOnline ? '1px solid #10b981' : '1px solid #ef4444'
            }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 8
                }}>
                  <h4 style={{ fontSize: 18, fontWeight: 600 }}>{door.name}</h4>
                  <div style={{ 
                    padding: '4px 8px', 
                    borderRadius: 4, 
                    fontSize: 12,
                    background: door.isOnline ? '#10b981' : '#ef4444',
                    color: 'white'
                  }}>
                    {door.isOnline ? 'ONLINE' : 'OFFLINE'}
                  </div>
                </div>
                <div style={{ fontSize: 14, color: '#888', marginBottom: 12 }}>
                  {door.location}
                </div>
                <div style={{ fontSize: 14 }}>
                  Status: <span style={{ 
                    color: door.status === 'open' ? '#10b981' : 
                           door.status === 'closed' ? '#6b7280' : '#f59e0b',
                    fontWeight: 600
                  }}>
                    {door.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  onClick={() => handleDoorControl(door.id, 'open')}
                  disabled={!door.isOnline}
                  style={{
                    padding: '8px 12px',
                    background: door.isOnline ? '#10b981' : '#6b7280',
                    color: '#1f2937',
                    border: 'none',
                    borderRadius: 6,
                    cursor: door.isOnline ? 'pointer' : 'not-allowed',
                    fontSize: 14
                  }}
                >
                  Open
                </button>
                <button
                  onClick={() => handleDoorControl(door.id, 'close')}
                  disabled={!door.isOnline}
                  style={{
                    padding: '8px 12px',
                    background: door.isOnline ? '#6b7280' : '#4b5563',
                    color: '#1f2937',
                    border: 'none',
                    borderRadius: 6,
                    cursor: door.isOnline ? 'pointer' : 'not-allowed',
                    fontSize: 14
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => handleDoorControl(door.id, 'lock')}
                  disabled={!door.isOnline}
                  style={{
                    padding: '8px 12px',
                    background: door.isOnline ? '#f59e0b' : '#6b7280',
                    color: '#1f2937',
                    border: 'none',
                    borderRadius: 6,
                    cursor: door.isOnline ? 'pointer' : 'not-allowed',
                    fontSize: 14
                  }}
                >
                  Lock
                </button>
                <button
                  onClick={() => handleDoorControl(door.id, 'unlock')}
                  disabled={!door.isOnline}
                  style={{
                    padding: '8px 12px',
                    background: door.isOnline ? '#3b82f6' : '#6b7280',
                    color: '#1f2937',
                    border: 'none',
                    borderRadius: 6,
                    cursor: door.isOnline ? 'pointer' : 'not-allowed',
                    fontSize: 14
                  }}
                >
                  Unlock
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLogs = () => (
    <div>
      <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 32 }}>Access Logs</h2>
      <div style={{ background: '#ffffff', padding: 24, borderRadius: 12, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ fontSize: 24, marginBottom: 16 }}>Recent Activity</h3>
        <div style={{ color: '#888', textAlign: 'center', padding: '40px 0' }}>
          Logs functionality will be implemented with backend integration
        </div>
      </div>
    </div>
  );

 

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px',
          fontSize: 18,
          color: '#888'
        }}>
          Loading...
        </div>
      );
    }

    switch (currentView) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'doors':
        return renderDoors();
      case 'door-control':
        return renderDoorControl();
      case 'logs':
        return renderLogs();
      
      default:
        return renderOverview();
    }
  };

  return (
    <div>
      <Header />
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb', color: '#1f2937' }}>
      <aside style={{ 
        width: 260, 
        background: '#154576', // Primary color from contact section
        padding: 24, 
        borderRight: '1px solid #e5e7eb',
        boxShadow: '2px 0 6px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 10,
        display: 'block',
        visibility: 'visible'
      }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32, color: '#ffffff' }}>Smart Door Admin</h1>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li 
              onClick={() => setCurrentView('overview')}
              style={{ 
                marginBottom: 12, 
                cursor: 'pointer',
                padding: '12px 16px',
                borderRadius: 8,
                background: currentView === 'overview' ? '#f59e0b' : 'transparent',
                color: currentView === 'overview' ? '#ffffff' : '#e5e7eb',
                fontWeight: currentView === 'overview' ? '600' : '500',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                borderLeft: currentView === 'overview' ? '3px solid #ffffff' : '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (currentView !== 'overview') {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== 'overview') {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#e5e7eb';
                }
              }}
            >
              📊 Dashboard
            </li>
            <li 
              onClick={() => setCurrentView('users')}
              style={{ 
                marginBottom: 12, 
                cursor: 'pointer',
                padding: '12px 16px',
                borderRadius: 8,
                background: currentView === 'users' ? '#f59e0b' : 'transparent',
                color: currentView === 'users' ? '#ffffff' : '#e5e7eb',
                fontWeight: currentView === 'users' ? '600' : '500',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                borderLeft: currentView === 'users' ? '3px solid #ffffff' : '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (currentView !== 'users') {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== 'users') {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#e5e7eb';
                }
              }}
            >
              👥 Manage Users
            </li>
            <li 
              onClick={() => setCurrentView('doors')}
              style={{ 
                marginBottom: 12, 
                cursor: 'pointer',
                padding: '12px 16px',
                borderRadius: 8,
                background: currentView === 'doors' ? '#f59e0b' : 'transparent',
                color: currentView === 'doors' ? '#ffffff' : '#e5e7eb',
                fontWeight: currentView === 'doors' ? '600' : '500',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                borderLeft: currentView === 'doors' ? '3px solid #ffffff' : '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (currentView !== 'doors') {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== 'doors') {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#e5e7eb';
                }
              }}
            >
              🚪 Doors
            </li>
            <li 
              onClick={() => setCurrentView('door-control')}
              style={{ 
                marginBottom: 12, 
                cursor: 'pointer',
                padding: '12px 16px',
                borderRadius: 8,
                background: currentView === 'door-control' ? '#f59e0b' : 'transparent',
                color: currentView === 'door-control' ? '#ffffff' : '#e5e7eb',
                fontWeight: currentView === 'door-control' ? '600' : '500',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                borderLeft: currentView === 'door-control' ? '3px solid #ffffff' : '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (currentView !== 'door-control') {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== 'door-control') {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#e5e7eb';
                }
              }}
            >
              🎛️ Door Control
            </li>
            <li 
              onClick={() => setCurrentView('logs')}
              style={{ 
                marginBottom: 12, 
                cursor: 'pointer',
                padding: '12px 16px',
                borderRadius: 8,
                background: currentView === 'logs' ? '#f59e0b' : 'transparent',
                color: currentView === 'logs' ? '#ffffff' : '#e5e7eb',
                fontWeight: currentView === 'logs' ? '600' : '500',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                borderLeft: currentView === 'logs' ? '3px solid #ffffff' : '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (currentView !== 'logs') {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== 'logs') {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#e5e7eb';
                }
              }}
            >
              📋 View Logs
            </li>
            
            <hr style={{ margin: '24px 0', borderColor: 'rgba(255, 255, 255, 0.2)', borderWidth: '1px' }} />
            <li 
              onClick={logout} 
              style={{ 
                cursor: 'pointer',
                padding: '12px 16px',
                borderRadius: 8,
                color: '#ef4444',
                fontWeight: '500',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                borderLeft: '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#ef4444';
              }}
            >
              🚪 Logout
            </li>
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 40, background: '#f9fafb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: '#154576' }}>Admin Dashboard</h2>
            <div style={{ fontSize: 16, color: '#6b7280', marginTop: 8 }}>
              Welcome, {user?.name} ({user?.role?.toUpperCase()})
            </div>
          </div>
          
          {/* Real-time Connection Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              padding: '8px 12px',
              background: isConnected ? '#10b981' : '#ef4444',
              color: 'white',
              borderRadius: 6,
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: isConnected ? '#ffffff' : '#ffffff',
                animation: isConnected ? 'pulse 2s infinite' : 'none'
              }} />
              {isConnected ? 'Live' : 'Offline'}
              {connectionType === 'websocket' && ' (WebSocket)'}
              {connectionType === 'polling' && ' (Polling)'}
            </div>
            
            {lastUpdate && (
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Last update: {new Date(lastUpdate).toLocaleTimeString()}
              </div>
            )}
            
            <button
              onClick={refresh}
              style={{
                padding: '6px 12px',
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>
        {renderContent()}
      </main>
      </div>
    </div>
  );
};

export default AdDashboard;