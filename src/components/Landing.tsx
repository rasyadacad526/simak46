import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, Users, Wrench } from 'lucide-react';
import { Item, RepairTask, BorrowRecord } from '../types';

interface LandingProps {
  onLoginClick: () => void;
  items: Item[];
  repairs: RepairTask[];
  borrows: BorrowRecord[];
}

export default function Landing({ onLoginClick, items, repairs, borrows }: LandingProps) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: i,
      assets: Math.floor(Math.random() * 50) + 100,
      activity: Math.floor(Math.random() * 20) + 10,
    }));
    setData(initialData);

    const interval = setInterval(() => {
      setData((currentData) => {
        const newData = [...currentData.slice(1)];
        const lastTime = newData[newData.length - 1].time;
        newData.push({
          time: lastTime + 1,
          assets: Math.floor(Math.random() * 50) + 100,
          activity: Math.floor(Math.random() * 20) + 10,
        });
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
      <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2">
          <div className="text-blue-600">
             <Package size={24} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">SIMAK 46</h1>
        </div>
        <button 
          onClick={onLoginClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium text-sm transition-colors"
        >
          Masuk
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-12">
        <div className="text-center max-w-2xl mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">SIMAK 46: Sistem Manajemen Aset & Kolaborasi</h2>
          <p className="text-lg text-gray-600">
            Kolaborasi SMKN 46 dalam memantau ketersediaan barang, peminjaman, dan perbaikan. Dibuat agar kita bisa 'menyimak' dan merawat fasilitas bersama untuk masa depan.
          </p>
        </div>

        <div className="w-full max-w-5xl bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-10">
          <div className="mb-6 flex justify-between items-end">
             <div>
               <h3 className="text-lg font-semibold text-gray-900">Aktivitas Sistem</h3>
               <p className="text-sm text-gray-500">Grafik penggunaan dan pergerakan aset.</p>
             </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(val) => `${val}`} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '8px' }}
                />
                <Area type="monotone" name="Total Aset" dataKey="assets" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAssets)" isAnimationActive={false} />
                <Area type="monotone" name="Transaksi" dataKey="activity" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorActivity)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
           <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Package size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Katalog Barang</h4>
                  <p className="text-xs text-gray-500">{items.length} Total Aset</p>
                </div>
              </div>
              <div className="space-y-3">
                {items.slice(0, 3).map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm py-2 border-b border-gray-100 last:border-0">
                    <span className="font-medium text-gray-700">{item.name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      item.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.stock} Unit
                    </span>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Peminjaman</h4>
                  <p className="text-xs text-gray-500">{borrows.filter(b => b.status === 'Dipinjam').length} Aktif</p>
                </div>
              </div>
              <div className="space-y-3">
                {borrows.slice(0, 3).map(record => (
                  <div key={record.id} className="flex flex-col text-sm py-2 border-b border-gray-100 last:border-0">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">{record.borrowerName}</span>
                      <span className="text-xs text-indigo-600 font-medium">{record.status}</span>
                    </div>
                    <span className="text-xs text-gray-500">{record.itemName}</span>
                  </div>
                ))}
                {borrows.length === 0 && (
                  <div className="text-center text-sm text-gray-500 py-2">Tidak ada peminjaman aktif</div>
                )}
              </div>
           </div>

           <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Wrench size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Perbaikan</h4>
                  <p className="text-xs text-gray-500">{repairs.filter(r => r.status !== 'Selesai').length} Menunggu</p>
                </div>
              </div>
              <div className="space-y-3">
                {repairs.slice(0, 3).map(repair => (
                  <div key={repair.id} className="flex flex-col text-sm py-2 border-b border-gray-100 last:border-0">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">{repair.itemName}</span>
                      <span className="text-xs text-amber-600 font-medium">{repair.status}</span>
                    </div>
                    <span className="text-xs text-gray-500">{repair.description}</span>
                  </div>
                ))}
                {repairs.length === 0 && (
                  <div className="text-center text-sm text-gray-500 py-2">Semua sistem aman</div>
                )}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
