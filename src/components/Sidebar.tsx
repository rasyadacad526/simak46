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
    <nav className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col gap-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors ${
              isActive 
                ? 'bg-blue-50 text-blue-700 font-medium' 
                : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <Icon size={18} className={isActive ? "text-blue-700" : "text-gray-400"} />
            <span className="text-sm">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
