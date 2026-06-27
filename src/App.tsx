import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Scanner from './components/Scanner';
import Repairs from './components/Repairs';
import Borrowing from './components/Borrowing';
import Landing from './components/Landing';
import Login from './components/Login';
import UsersManagement from './components/UsersManagement';

import { initialItems, initialRepairs, initialBorrows, initialUsers } from './data';
import { Package, LogOut } from 'lucide-react';
import { User } from './types';

export default function App() {
  const [authView, setAuthView] = useState<'landing' | 'login' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [items, setItems] = useState(initialItems);
  const [repairs, setRepairs] = useState(initialRepairs);
  const [borrows, setBorrows] = useState(initialBorrows);
  const [users, setUsers] = useState(initialUsers);

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthView('landing');
  };

  if (authView === 'landing') {
    return <Landing onLoginClick={() => setAuthView('login')} items={items} repairs={repairs} borrows={borrows} />;
  }

  if (authView === 'login') {
    return <Login onLogin={(user) => { setCurrentUser(user); setAuthView('app'); }} onBack={() => setAuthView('landing')} users={users} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-mesh font-sans overflow-hidden text-slate-200 selection:bg-purple-500/30 selection:text-white relative">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-pink-500/10 pointer-events-none -z-10"></div>
      <header className="h-16 flex items-center justify-between px-6 glass-panel shrink-0 z-20 border-b border-white/10 relative">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.5)]">
             <Package size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-display font-bold uppercase tracking-wider text-gradient">SIMAK 46</h1>
        </div>

        <div className="flex items-center gap-4">
          {currentUser && (
            <div className="text-sm font-mono flex items-center gap-2">
              <span className="text-slate-400">Hi,</span>
              <span className="text-white font-bold">{currentUser.name}</span>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 transition-all font-mono text-sm font-medium rounded-full"
          >
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} currentUserRole={currentUser?.role} />
        
        <main className="flex-1 overflow-y-auto p-8 relative z-0">
          <div className="max-w-6xl mx-auto relative">
            {activeTab === 'dashboard' && <Dashboard items={items} repairs={repairs} borrows={borrows} />}
            {activeTab === 'inventory' && <Inventory items={items} setItems={setItems} />}
            {activeTab === 'scanner' && <Scanner items={items} />}
            {activeTab === 'repairs' && <Repairs repairs={repairs} />}
            {activeTab === 'borrowing' && <Borrowing borrows={borrows} />}
            {activeTab === 'users' && currentUser?.role === 'Admin' && <UsersManagement users={users} setUsers={setUsers} currentUser={currentUser} />}
          </div>
        </main>
      </div>
    </div>
  );
}
