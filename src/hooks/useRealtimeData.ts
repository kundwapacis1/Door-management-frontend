// src/hooks/useRealtimeData.ts
// React hook for real-time data management

import { useState, useEffect, useCallback } from 'react';
import realtimeService, { DoorStatus, UserActivity, DashboardStats } from '../services/realtimeService';

export interface RealtimeData {
  doorStatuses: DoorStatus[];
  userActivities: UserActivity[];
  dashboardStats: DashboardStats | null;
  connectionStatus: {
    type: 'websocket' | 'polling' | 'none';
    status: 'connected' | 'disconnected' | 'error';
  };
  lastUpdate: string | null;
}

export const useRealtimeData = (backendUrl?: string) => {
  const [data, setData] = useState<RealtimeData>({
    doorStatuses: [],
    userActivities: [],
    dashboardStats: null,
    connectionStatus: { type: 'none', status: 'disconnected' },
    lastUpdate: null
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update connection status
  const updateConnectionStatus = useCallback(() => {
    const status = realtimeService.getConnectionStatus();
    setData(prev => ({
      ...prev,
      connectionStatus: status
    }));
  }, []);

  // Handle door status updates
  const handleDoorStatusUpdate = useCallback((doorStatuses: DoorStatus[]) => {
    setData(prev => ({
      ...prev,
      doorStatuses,
      lastUpdate: new Date().toISOString()
    }));
    setIsLoading(false);
    setError(null);
  }, []);

  // Handle user activity updates
  const handleUserActivityUpdate = useCallback((activities: UserActivity[]) => {
    setData(prev => ({
      ...prev,
      userActivities: activities.slice(0, 10), // Keep only recent 10 activities
      lastUpdate: new Date().toISOString()
    }));
  }, []);

  // Handle dashboard stats updates
  const handleDashboardStatsUpdate = useCallback((stats: DashboardStats) => {
    setData(prev => ({
      ...prev,
      dashboardStats: stats,
      lastUpdate: new Date().toISOString()
    }));
  }, []);

  // Handle connection status changes
  const handleConnectionUpdate = useCallback((status: any) => {
    updateConnectionStatus();
    if (status.status === 'error') {
      setError('Connection error occurred');
    } else {
      setError(null);
    }
  }, [updateConnectionStatus]);

  // Initialize real-time connection
  useEffect(() => {
    setIsLoading(true);
    
    // Connect to real-time service
    if (backendUrl) {
      realtimeService.connect(backendUrl);
    } else {
      realtimeService.connect(); // Use default URL
    }

    // Subscribe to real-time updates
    const unsubscribeDoorStatus = realtimeService.subscribe('doorStatus', handleDoorStatusUpdate);
    const unsubscribeUserActivity = realtimeService.subscribe('userActivity', handleUserActivityUpdate);
    const unsubscribeDashboardStats = realtimeService.subscribe('dashboardStats', handleDashboardStatsUpdate);
    const unsubscribeConnection = realtimeService.subscribe('connection', handleConnectionUpdate);

    // Initial connection status check
    updateConnectionStatus();

    // Cleanup on unmount
    return () => {
      unsubscribeDoorStatus();
      unsubscribeUserActivity();
      unsubscribeDashboardStats();
      unsubscribeConnection();
      realtimeService.disconnect();
    };
  }, [backendUrl, handleDoorStatusUpdate, handleUserActivityUpdate, handleDashboardStatsUpdate, handleConnectionUpdate, updateConnectionStatus]);

  // Send command to backend
  const sendCommand = useCallback((command: string, data: any) => {
    realtimeService.sendCommand(command, data);
  }, []);

  // Manual refresh
  const refresh = useCallback(() => {
    setIsLoading(true);
    // Trigger a manual update by sending a refresh command
    realtimeService.sendCommand('refresh', {});
  }, []);

  // Get specific door status
  const getDoorStatus = useCallback((doorId: string) => {
    return data.doorStatuses.find(door => door.id === doorId);
  }, [data.doorStatuses]);

  // Get recent activities for a specific door
  const getDoorActivities = useCallback((doorId: string) => {
    return data.userActivities.filter(activity => activity.doorId === doorId);
  }, [data.userActivities]);

  return {
    // Data
    doorStatuses: data.doorStatuses,
    userActivities: data.userActivities,
    dashboardStats: data.dashboardStats,
    connectionStatus: data.connectionStatus,
    lastUpdate: data.lastUpdate,
    
    // State
    isLoading,
    error,
    
    // Actions
    sendCommand,
    refresh,
    getDoorStatus,
    getDoorActivities,
    
    // Connection info
    isConnected: data.connectionStatus.status === 'connected',
    connectionType: data.connectionStatus.type
  };
};

export default useRealtimeData;
