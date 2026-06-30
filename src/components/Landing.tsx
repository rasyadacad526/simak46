import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, Users, Wrench, Search } from 'lucide-react';
import { Item, RepairTask, BorrowRecord } from '../types';

interface LandingProps {
  onLoginClick: () => void;
  items: Item[];
  repairs: RepairTask[];
  borrows: BorrowRecord[];
}

export default function Landing({ onLoginClick, items, repairs, borrows }: LandingProps) {
  const [data, setData] = useState<any[]>([]);
  const [searchItems, setSearchItems] = useState('');
  const [searchBorrows, setSearchBorrows] = useState('');
  const [searchRepairs, setSearchRepairs] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(searchItems.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchItems.toLowerCase()) ||
      item.category.toLowerCase().includes(searchItems.toLowerCase()) ||
      item.location.toLowerCase().includes(searchItems.toLowerCase())
    );
  }, [items, searchItems]);

  const filteredBorrows = useMemo(() => {
    return borrows.filter(record => 
      record.borrowerName.toLowerCase().includes(searchBorrows.toLowerCase()) ||
      record.itemName.toLowerCase().includes(searchBorrows.toLowerCase()) ||
      record.status.toLowerCase().includes(searchBorrows.toLowerCase())
    );
  }, [borrows, searchBorrows]);

  const filteredRepairs = useMemo(() => {
    return repairs.filter(repair => 
      repair.itemName.toLowerCase().includes(searchRepairs.toLowerCase()) ||
      repair.description.toLowerCase().includes(searchRepairs.toLowerCase()) ||
      repair.status.toLowerCase().includes(searchRepairs.toLowerCase())
    );
  }, [repairs, searchRepairs]);

  const currentStats = React.useRef({
    assets: items.reduce((acc, item) => acc + item.stock, 0),
    activity: borrows.length + repairs.length,
  });

  useEffect(() => {
    currentStats.current = {
      assets: items.reduce((acc, item) => acc + item.stock, 0),
      activity: borrows.length + repairs.length,
    };
  }, [items, borrows, repairs]);

  useEffect(() => {
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: i,
      assets: currentStats.current.assets,
      activity: currentStats.current.activity,
    }));
    setData(initialData);

    const interval = setInterval(() => {
      setData((currentData) => {
        const newData = [...currentData.slice(1)];
        const lastTime = newData[newData.length - 1].time;
        newData.push({
          time: lastTime + 1,
          assets: currentStats.current.assets,
          activity: currentStats.current.activity,
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

        <div className="flex flex-col gap-8 w-full max-w-5xl mb-12">
           <div className="glass-card rounded-2xl overflow-hidden flex flex-col">
             <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
                    <Package size={24} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white uppercase tracking-wider">Katalog Barang</h4>
                    <p className="text-xs font-mono text-slate-400 mt-1">{items.length} TOTAL ASET</p>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Cari barang..."
                    className="w-full sm:w-64 pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-blue-500/50 text-white placeholder-slate-500"
                    value={searchItems}
                    onChange={(e) => setSearchItems(e.target.value)}
                  />
                </div>
             </div>
             <div className="overflow-x-auto max-h-96 overflow-y-auto">
               <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead className="sticky top-0 bg-[#151520] z-10">
                    <tr className="border-b border-white/10 text-xs font-mono uppercase tracking-wider text-slate-400">
                      <th className="p-4 font-medium">SKU</th>
                      <th className="p-4 font-medium">Nama Barang</th>
                      <th className="p-4 font-medium">Kategori</th>
                      <th className="p-4 font-medium">Stok</th>
                      <th className="p-4 font-medium">Lokasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredItems.map(item => (
                       <tr key={item.id} className="hover:bg-white/5 transition-colors">
                         <td className="p-4 text-slate-400 font-mono text-xs">{item.sku}</td>
                         <td className="p-4 text-white font-medium">{item.name}</td>
                         <td className="p-4 text-slate-300">{item.category}</td>
                         <td className="p-4">
                           <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                             item.stock > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                           }`}>
                             {item.stock} Unit
                           </span>
                         </td>
                         <td className="p-4 text-slate-400">{item.location}</td>
                       </tr>
                    ))}
                    {filteredItems.length === 0 && (
                      <tr><td colSpan={5} className="p-8 text-center text-slate-500 font-mono text-xs uppercase tracking-wider">Tidak ada barang</td></tr>
                    )}
                  </tbody>
               </table>
             </div>
           </div>

           <div className="glass-card rounded-2xl overflow-hidden flex flex-col">
             <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white uppercase tracking-wider">Peminjam Aktif</h4>
                    <p className="text-xs font-mono text-slate-400 mt-1">{borrows.filter(b => b.status === 'Dipinjam').length} AKTIF</p>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Cari peminjam..."
                    className="w-full sm:w-64 pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-purple-500/50 text-white placeholder-slate-500"
                    value={searchBorrows}
                    onChange={(e) => setSearchBorrows(e.target.value)}
                  />
                </div>
             </div>
             <div className="overflow-x-auto max-h-96 overflow-y-auto">
               <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead className="sticky top-0 bg-[#151520] z-10">
                    <tr className="border-b border-white/10 text-xs font-mono uppercase tracking-wider text-slate-400">
                      <th className="p-4 font-medium">Nama Peminjam</th>
                      <th className="p-4 font-medium">Barang</th>
                      <th className="p-4 font-medium">Tanggal Pinjam</th>
                      <th className="p-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredBorrows.map(record => (
                       <tr key={record.id} className="hover:bg-white/5 transition-colors">
                         <td className="p-4 text-white font-medium">{record.borrowerName}</td>
                         <td className="p-4 text-slate-300">{record.itemName}</td>
                         <td className="p-4 text-slate-400 font-mono text-xs">{new Date(record.borrowDate).toLocaleDateString('id-ID')}</td>
                         <td className="p-4">
                           <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                             record.status === 'Dipinjam' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                           }`}>
                             {record.status}
                           </span>
                         </td>
                       </tr>
                    ))}
                    {filteredBorrows.length === 0 && (
                      <tr><td colSpan={4} className="p-8 text-center text-slate-500 font-mono text-xs uppercase tracking-wider">TIDAK ADA PEMINJAMAN</td></tr>
                    )}
                  </tbody>
               </table>
             </div>
           </div>

           <div className="glass-card rounded-2xl overflow-hidden flex flex-col">
             <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-pink-500/20 text-pink-400 rounded-xl">
                    <Wrench size={24} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white uppercase tracking-wider">Perbaikan</h4>
                    <p className="text-xs font-mono text-slate-400 mt-1">{repairs.filter(r => r.status !== 'Selesai').length} MENUNGGU</p>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Cari perbaikan..."
                    className="w-full sm:w-64 pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-pink-500/50 text-white placeholder-slate-500"
                    value={searchRepairs}
                    onChange={(e) => setSearchRepairs(e.target.value)}
                  />
                </div>
             </div>
             <div className="overflow-x-auto max-h-96 overflow-y-auto">
               <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead className="sticky top-0 bg-[#151520] z-10">
                    <tr className="border-b border-white/10 text-xs font-mono uppercase tracking-wider text-slate-400">
                      <th className="p-4 font-medium">Barang</th>
                      <th className="p-4 font-medium">Tanggal Lapor</th>
                      <th className="p-4 font-medium">Deskripsi</th>
                      <th className="p-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredRepairs.map(repair => (
                       <tr key={repair.id} className="hover:bg-white/5 transition-colors">
                         <td className="p-4 text-white font-medium">{repair.itemName}</td>
                         <td className="p-4 text-slate-400 font-mono text-xs">{new Date(repair.dateReported).toLocaleDateString('id-ID')}</td>
                         <td className="p-4 text-slate-400 max-w-[200px] truncate">{repair.description}</td>
                         <td className="p-4">
                           <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                             repair.status === 'Selesai' ? 'bg-emerald-500/20 text-emerald-300' :
                             repair.status === 'Diproses' ? 'bg-blue-500/20 text-blue-300' :
                             'bg-amber-500/20 text-amber-300'
                           }`}>
                             {repair.status}
                           </span>
                         </td>
                       </tr>
                    ))}
                    {filteredRepairs.length === 0 && (
                      <tr><td colSpan={4} className="p-8 text-center text-slate-500 font-mono text-xs uppercase tracking-wider">SEMUA SISTEM AMAN</td></tr>
                    )}
                  </tbody>
               </table>
             </div>
           </div>
        </div>
      </main>
    </div>
  );
}
