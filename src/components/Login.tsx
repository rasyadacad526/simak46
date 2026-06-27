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
    <div className="min-h-screen bg-gradient-mesh flex items-center justify-center p-4 font-sans text-slate-200 selection:bg-purple-500/30 selection:text-white relative">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none"></div>
      <div className="w-full max-w-md glass-panel rounded-3xl relative z-10 overflow-hidden">
        <div className="p-8">
          <button 
            onClick={onBack}
            className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-mono mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            BACK
          </button>

          <div className="flex flex-col items-center mb-10 relative">
            <div className="absolute inset-0 bg-purple-500/20 blur-[50px] rounded-full w-24 h-24 mx-auto -z-10"></div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center justify-center mb-6">
               <Package size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider text-gradient">SIMAK 46</h2>
            <p className="text-xs font-mono font-medium mt-2 text-slate-400 uppercase tracking-[0.2em]">Secure Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-400 mb-2 uppercase tracking-wider">Email Operator</label>
              <input 
                type="email"
                required
                placeholder="admin@smkn46.sch.id"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder-slate-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-xs font-mono font-medium text-slate-400 mb-2 uppercase tracking-wider">Passcode</label>
              <input 
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder-slate-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-4 rounded-xl font-display font-bold text-lg mt-8 transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] uppercase tracking-wider border border-white/10"
            >
              Authenticate
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
