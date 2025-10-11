import React, { useState } from "react";
import { Input } from '../component/Input'; // your reusable Input
import { BigButton } from "../component/ButtonComp"; // your reusable BigButton
import Header from "../component/Header";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // error state
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loginError, setLoginError] = useState<string>("");

  // auth and navigation
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  // simple validation
  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoginError("");
    
    try {
      // Use email as username for login (you can modify this based on your needs)
      const success = await login(email, password);
      
      if (success) {
        // Get the user data from localStorage to determine role
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          
          // Role-based redirection
          if (user.role === 'admin') {
            navigate('/admindashboard');
          } else if (user.role === 'user') {
            navigate('/userdashboard');
          } else {
            // Default fallback
            navigate('/userdashboard');
          }
        }
      } else {
        setLoginError("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError("Login failed. Please try again.");
    }
  };

  return (
    <>
    
     <Header/>
 
    
    <div className="min-h-screen flex items-center justify-center pt-[100px] bg-gray-50 px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-2xl shadow-xl">
        
        {/* Left Side */}
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 flex items-center justify-center bg-amber-500 rounded-xl">
              🔐
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Smart Door Management</h1>
          </div>
          <p className="text-gray-600 mb-6">
            Secure access & real-time door control
          </p>
          <p className="text-gray-600 mb-4">
            Login to manage doors, check access logs, configure PINs and RFID
            cards, and control lock states in real time.
          </p>

          <div className="text-sm text-gray-500 space-y-2">
            <p>Demo Credentials:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Admin:</strong> admin@example.com / admin</li>
              <li><strong>User:</strong> user@example.com / user</li>
            </ul>
            <p className="mt-4">Tips:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use your work email to sign in.</li>
              <li>
                Use "Simulate RFID" to test RFID-based login on this page
                (demo).
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side - Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h2 className="text-lg font-semibold mb-6 text-gray-800">Sign in</h2>

          {/* Login Error Display */}
          {loginError && (
            <div className="mb-4 p-3 bg-red-500 text-white rounded-lg text-sm">
              {loginError}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-amber-500 rounded"
                />
                <span className="text-gray-700">Remember me</span>
              </label>
              <a href="#" className="text-amber-500 hover:text-amber-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <BigButton 
                type="submit" 
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </BigButton>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};
