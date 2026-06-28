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
    <div className="min-h-screen bg-gradient-mesh text-slate-200 font-sans flex flex-col selection:bg-purple-500/30 selection:text-white">
      <header className="h-16 flex items-center justify-between px-6 glass-panel shrink-0 relative z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.5)]">
             <Package size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider text-gradient">SIMAK 46</h1>
        </div>
        <button 
          onClick={onLoginClick}
          className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-mono font-medium text-sm transition-all border border-white/20 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        >
          MASUK
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-16">
        <div className="text-center max-w-3xl mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-[100px] opacity-20 -z-10 rounded-full"></div>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 uppercase leading-tight tracking-tight">
            Manajemen Aset <br/>
            <span className="text-gradient">Terintegrasi</span>
          </h2>
          <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">
            Kolaborasi SMKN 46 dalam memantau ketersediaan barang, peminjaman, dan perbaikan. Dibuat agar kita bisa 'menyimak' dan merawat fasilitas bersama.
          </p>
        </div>

        <div className="w-full max-w-5xl glass-panel rounded-2xl p-6 mb-12">
          <div className="mb-6 flex justify-between items-end border-b border-white/10 pb-4">
             <div>
               <h3 className="text-xl font-display font-bold text-white uppercase tracking-wider">Aktivitas Sistem</h3>
               <p className="text-sm font-mono text-slate-400 mt-1">Metrik Real-time</p>
             </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" hide />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} fontFamily="JetBrains Mono" tickFormatter={(val) => `${val}`} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 15, 20, 0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontFamily: 'JetBrains Mono', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" name="Total Aset" dataKey="assets" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorAssets)" isAnimationActive={false} />
                <Area type="monotone" name="Transaksi" dataKey="activity" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
           <div className="glass-card rounded-2xl p-6 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                  <Package size={24} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-white uppercase tracking-wider">Katalog Barang</h4>
                  <p className="text-xs font-mono text-slate-400 mt-1">{items.length} TOTAL ASET</p>
                </div>
              </div>
              <div className="space-y-3">
                {items.slice(0, 3).map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm py-3 px-4 bg-white/5 rounded-xl border border-white/5">
                    <span className="font-medium text-slate-200">{item.name}</span>
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      item.stock > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {item.stock} Unit
                    </span>
                  </div>
                ))}
              </div>
           </div>

           <div className="glass-card rounded-2xl p-6 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-white uppercase tracking-wider">Peminjaman</h4>
                  <p className="text-xs font-mono text-slate-400 mt-1">{borrows.filter(b => b.status === 'Dipinjam').length} AKTIF</p>
                </div>
              </div>
              <div className="space-y-3">
                {borrows.slice(0, 3).map(record => (
                  <div key={record.id} className="flex flex-col text-sm py-3 px-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-slate-200">{record.borrowerName}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider bg-white/10 text-slate-300 px-2 py-0.5 rounded-md">{record.status}</span>
                    </div>
                    <span className="text-xs text-slate-400">{record.itemName}</span>
                  </div>
                ))}
                {borrows.length === 0 && (
                  <div className="text-center text-xs font-mono text-slate-500 py-4 uppercase tracking-wider">TIDAK ADA PEMINJAMAN</div>
                )}
              </div>
           </div>

           <div className="glass-card rounded-2xl p-6 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-pink-500/20 text-pink-400 rounded-xl group-hover:bg-pink-500/30 transition-colors">
                  <Wrench size={24} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-white uppercase tracking-wider">Perbaikan</h4>
                  <p className="text-xs font-mono text-slate-400 mt-1">{repairs.filter(r => r.status !== 'Selesai').length} MENUNGGU</p>
                </div>
              </div>
              <div className="space-y-3">
                {repairs.slice(0, 3).map(repair => (
                  <div key={repair.id} className="flex flex-col text-sm py-3 px-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-slate-200">{repair.itemName}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider bg-white/10 text-slate-300 px-2 py-0.5 rounded-md">{repair.status}</span>
                    </div>
                    <span className="text-xs text-slate-400 line-clamp-1">{repair.description}</span>
                  </div>
                ))}
                {repairs.length === 0 && (
                  <div className="text-center text-xs font-mono text-slate-500 py-4 uppercase tracking-wider">SEMUA SISTEM AMAN</div>
                )}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
