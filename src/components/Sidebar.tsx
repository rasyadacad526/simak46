import React from 'react';
import { LayoutDashboard, Package, Wrench, Users, ScanBarcode } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Katalog Barang', icon: Package },
    { id: 'scanner', label: 'Scanner', icon: ScanBarcode },
    { id: 'repairs', label: 'Perbaikan', icon: Wrench },
    { id: 'borrowing', label: 'Peminjaman', icon: Users },
  ];

  return (
    <nav className="w-64 glass-panel border-r border-t-0 border-b-0 border-white/10 p-6 flex flex-col gap-2 z-10">
      <div className="text-xs font-mono font-medium text-slate-500 mb-4 uppercase tracking-widest pl-2">Menu Navigasi</div>
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive 
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                : 'bg-transparent border border-transparent font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Icon size={20} className={isActive ? "text-purple-400" : ""} />
            <span className="text-sm font-display tracking-wide">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
