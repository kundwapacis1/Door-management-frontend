// src/services/realtimeService.ts
// Real-time data service for door management system

export interface DoorStatus {
  id: string;
  name: string;
  location: string;
  status: 'open' | 'closed' | 'locked';
  isOnline: boolean;
  lastUpdate: string;
  batteryLevel?: number;
}

export interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  doorId: string;
  doorName: string;
  action: 'entry' | 'exit' | 'denied';
  timestamp: string;
  method: 'pin' | 'rfid' | 'fingerprint';
}

export interface DashboardStats {
  totalUsers: number;
  totalDoors: number;
  activeDoors: number;
  recentActivity: number;
  onlineDoors: number;
  offlineDoors: number;
}

class RealtimeService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isPolling = false;
  private pollingInterval: NodeJS.Timeout | null = null;
  private subscribers: Map<string, Set<Function>> = new Map();

  // WebSocket connection
  connect(backendUrl: string = 'ws://localhost:3001') {
    try {
      this.ws = new WebSocket(backendUrl);
      
      this.ws.onopen = () => {
        console.log('🔗 WebSocket connected');
        this.reconnectAttempts = 0;
        this.notifySubscribers('connection', { status: 'connected' });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleRealtimeData(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        this.notifySubscribers('connection', { status: 'disconnected' });
        this.attemptReconnect(backendUrl);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.notifySubscribers('connection', { status: 'error', error });
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.fallbackToPolling();
    }
  }

  // Fallback to polling if WebSocket fails
  private fallbackToPolling() {
    if (!this.isPolling) {
      console.log('📡 Falling back to polling mode');
      this.isPolling = true;
      this.startPolling();
    }
  }

  // Polling fallback
  private startPolling(interval: number = 5000) {
    this.pollingInterval = setInterval(async () => {
      try {
        // Fetch latest data from your API
        const [doorStatuses, stats, activities] = await Promise.all([
          this.fetchDoorStatuses(),
          this.fetchDashboardStats(),
          this.fetchRecentActivities()
        ]);

        this.handleRealtimeData({
          type: 'polling_update',
          data: {
            doorStatuses,
            stats,
            activities
          }
        });
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, interval);
  }

  // Handle incoming real-time data
  private handleRealtimeData(data: any) {
    switch (data.type) {
      case 'door_status_update':
        this.notifySubscribers('doorStatus', data.data);
        break;
      case 'user_activity':
        this.notifySubscribers('userActivity', data.data);
        break;
      case 'dashboard_stats':
        this.notifySubscribers('dashboardStats', data.data);
        break;
      case 'polling_update':
        this.notifySubscribers('doorStatus', data.data.doorStatuses);
        this.notifySubscribers('dashboardStats', data.data.stats);
        this.notifySubscribers('userActivity', data.data.activities);
        break;
      default:
        console.log('Unknown real-time data type:', data.type);
    }
  }

  // Subscribe to real-time updates
  subscribe(eventType: string, callback: Function) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(eventType);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          this.subscribers.delete(eventType);
        }
      }
    };
  }

  // Notify all subscribers
  private notifySubscribers(eventType: string, data: any) {
    const subscribers = this.subscribers.get(eventType);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in subscriber callback:', error);
        }
      });
    }
  }

  // Reconnection logic
  private attemptReconnect(backendUrl: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(backendUrl);
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.log('❌ Max reconnection attempts reached, falling back to polling');
      this.fallbackToPolling();
    }
  }

  // API calls for polling fallback
  private async fetchDoorStatuses(): Promise<DoorStatus[]> {
    const response = await fetch('http://localhost:3001/api/doors/statuses');
    return response.json();
  }

  private async fetchDashboardStats(): Promise<DashboardStats> {
    const response = await fetch('http://localhost:3001/api/dashboard/stats');
    return response.json();
  }

  private async fetchRecentActivities(): Promise<UserActivity[]> {
    const response = await fetch('http://localhost:3001/api/activities/recent');
    return response.json();
  }

  // Send command to backend
  sendCommand(command: string, data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'command',
        command,
        data
      }));
    } else {
      // Fallback to HTTP API
      this.sendCommandViaHTTP(command, data);
    }
  }

  private async sendCommandViaHTTP(command: string, data: any) {
    try {
      const response = await fetch(`http://localhost:3001/api/${command}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      console.error('HTTP command failed:', error);
    }
  }

  // Disconnect
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isPolling = false;
    this.subscribers.clear();
  }

  // Get connection status
  getConnectionStatus() {
    if (this.ws) {
      return {
        type: 'websocket',
        status: this.ws.readyState === WebSocket.OPEN ? 'connected' : 'disconnected'
      };
    } else if (this.isPolling) {
      return {
        type: 'polling',
        status: 'connected'
      };
    } else {
      return {
        type: 'none',
        status: 'disconnected'
      };
    }
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();
export default realtimeService;
