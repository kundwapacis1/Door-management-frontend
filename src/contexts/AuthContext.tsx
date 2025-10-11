import React, { createContext, useState, useEffect, type ReactNode } from 'react';

// Define the user type
interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  name?: string;
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // In a real app, you would validate the token with your backend
          // For now, we'll simulate a user
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Mock authentication for demo purposes
      if (email === 'admin@example.com' && password === 'admin') {
        const userData: User = {
          id: '1',
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin',
          name: 'Administrator'
        };
        
        setUser(userData);
        localStorage.setItem('authToken', 'mock-token');
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      } else if (email === 'user@example.com' && password === 'user') {
        const userData: User = {
          id: '2',
          username: 'user',
          email: 'user@example.com',
          role: 'user',
          name: 'Regular User'
        };
        
        setUser(userData);
        localStorage.setItem('authToken', 'mock-token');
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;


