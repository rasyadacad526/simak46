import React, { useState } from 'react';
import { Package, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export default function Login({ onLogin, onBack }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <button 
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Kembali
          </button>

          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-3">
               <Package size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">SIMAK 46</h2>
            <p className="text-sm text-gray-500 mt-1">Masuk dengan akun admin</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email"
                required
                placeholder="admin@contoh.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md font-medium text-sm mt-4 transition-colors"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
