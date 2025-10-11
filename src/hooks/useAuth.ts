import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

// Define the auth context type
interface AuthContextType {
  user: {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
    name?: string;
  } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
