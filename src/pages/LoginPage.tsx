import React, { useState } from "react";
import { Input } from '../component/Input'; // your reusable Input
import { BigButton } from "../component/ButtonComp"; // your reusable BigButton
import Header from "../component/Header";

export const LoginPage: React.FC = () => {
  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // error state
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // simple validation
  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    console.log({
      email,
      password,
      rememberMe,
    });
    // TODO: call your login API here
  };

  return (
    <>
    
     <Header/>
 
    
    <div className="min-h-screen flex items-center justify-center pt-[100px] bg-[#0f172a] text-white px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#111827] p-8 rounded-2xl shadow-lg">
        
        {/* Left Side */}
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-tr from-purple-500 to-blue-500 rounded-xl">
              📱
            </div>
            <h1 className="text-xl font-semibold">Smart Door Management</h1>
          </div>
          <p className="text-gray-400 mb-6">
            Secure access & real-time door control
          </p>
          <p className="text-gray-400 mb-4">
            Login to manage doors, check access logs, configure PINs and RFID
            cards, and control lock states in real time.
          </p>

          <div className="text-sm text-gray-500 space-y-2">
            <p>Tips:</p>
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
          className="bg-[#1e293b] p-6 rounded-xl shadow-md"
        >
          <h2 className="text-lg font-semibold mb-6">Sign in</h2>

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
              isDark
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
              isDark
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-500 rounded"
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-blue-400 hover:underline">
                Forgot password?
              </a>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <BigButton type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Sign in
              </BigButton>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};
