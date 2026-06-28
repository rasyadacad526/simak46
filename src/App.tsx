import React, { useState, useEffect } from 'react';
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
import { Package, LogOut, Menu, X } from 'lucide-react';
import { User, Item } from './types';

export default function App() {
  const [authView, setAuthView] = useState<'landing' | 'login' | 'app'>(() => {
    const saved = localStorage.getItem('simak46_authView');
    return (saved as 'landing' | 'login' | 'app') || 'landing';
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('simak46_currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem('simak46_items');
    return saved ? JSON.parse(saved) : initialItems;
  });
  const [repairs, setRepairs] = useState<RepairTask[]>(() => {
    const saved = localStorage.getItem('simak46_repairs');
    return saved ? JSON.parse(saved) : initialRepairs;
  });
  const [borrows, setBorrows] = useState<BorrowRecord[]>(() => {
    const saved = localStorage.getItem('simak46_borrows');
    return saved ? JSON.parse(saved) : initialBorrows;
  });
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('simak46_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });
  useEffect(() => {
    localStorage.setItem('simak46_authView', authView);
  }, [authView]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('simak46_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('simak46_currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('simak46_items', JSON.stringify(items));
    localStorage.setItem('simak46_repairs', JSON.stringify(repairs));
    localStorage.setItem('simak46_borrows', JSON.stringify(borrows));
    localStorage.setItem('simak46_users', JSON.stringify(users));
  }, [items, repairs, borrows, users]);

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
    <div className="flex flex-col h-[100dvh] bg-gradient-mesh font-sans overflow-hidden text-slate-200 selection:bg-purple-500/30 selection:text-white relative">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-pink-500/10 pointer-events-none -z-10"></div>
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 glass-panel shrink-0 z-20 border-b border-white/10 relative">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.5)] hidden sm:block">
             <Package size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-display font-bold uppercase tracking-wider text-gradient">SIMAK 46</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {currentUser && (
            <div className="text-xs sm:text-sm font-mono flex items-center gap-1 sm:gap-2">
              <span className="text-slate-400 hidden sm:inline">Hi,</span>
              <span className="text-white font-bold">{currentUser.name}</span>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 transition-all font-mono text-sm font-medium rounded-full"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsSidebarOpen(false);
          }} 
          currentUserRole={currentUser?.role} 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen}
        />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 relative z-0">
          <div className="max-w-6xl mx-auto relative">
            {activeTab === 'dashboard' && <Dashboard items={items} repairs={repairs} borrows={borrows} />}
            {activeTab === 'inventory' && <Inventory items={items} setItems={setItems} />}
            {activeTab === 'scanner' && <Scanner items={items} />}
            {activeTab === 'repairs' && <Repairs items={items} repairs={repairs} setRepairs={setRepairs} />}
            {activeTab === 'borrowing' && <Borrowing items={items} borrows={borrows} setBorrows={setBorrows} />}
            {activeTab === 'users' && currentUser?.role === 'Admin' && <UsersManagement users={users} setUsers={setUsers} currentUser={currentUser} />}
          </div>
        </main>
        
        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[30] md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
      </div>
    </div>
  );
}
