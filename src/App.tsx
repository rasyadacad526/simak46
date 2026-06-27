import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Scanner from './components/Scanner';
import Repairs from './components/Repairs';
import Borrowing from './components/Borrowing';
import Landing from './components/Landing';
import Login from './components/Login';

import { initialItems, initialRepairs, initialBorrows } from './data';
import { Package, LogOut } from 'lucide-react';

export default function App() {
  const [authView, setAuthView] = useState<'landing' | 'login' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [items, setItems] = useState(initialItems);
  const [repairs, setRepairs] = useState(initialRepairs);
  const [borrows, setBorrows] = useState(initialBorrows);

  if (authView === 'landing') {
    return <Landing onLoginClick={() => setAuthView('login')} items={items} repairs={repairs} borrows={borrows} />;
  }

  if (authView === 'login') {
    return <Login onLogin={() => setAuthView('app')} onBack={() => setAuthView('landing')} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans overflow-hidden">
      <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2">
          <div className="text-blue-600">
             <Package size={24} />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">SIMAK 46</h1>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setAuthView('landing')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Keluar</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {activeTab === 'dashboard' && <Dashboard items={items} repairs={repairs} borrows={borrows} />}
          {activeTab === 'inventory' && <Inventory items={items} setItems={setItems} />}
          {activeTab === 'scanner' && <Scanner items={items} />}
          {activeTab === 'repairs' && <Repairs repairs={repairs} />}
          {activeTab === 'borrowing' && <Borrowing borrows={borrows} />}
        </main>
      </div>
    </div>
  );
}
