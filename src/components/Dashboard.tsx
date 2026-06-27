import React from 'react';
import { Item, RepairTask, BorrowRecord } from '../types';

interface DashboardProps {
  items: Item[];
  repairs: RepairTask[];
  borrows: BorrowRecord[];
}

export default function Dashboard({ items, repairs, borrows }: DashboardProps) {
  const totalItems = items.reduce((acc, item) => acc + item.stock, 0);
  const lowStock = items.filter(i => i.stock > 0 && i.stock <= 5).length;
  const outOfStock = items.filter(i => i.stock === 0).length;
  const activeRepairs = repairs.filter(r => r.status !== 'Selesai').length;
  const activeBorrows = borrows.filter(b => b.status === 'Dipinjam').length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 group">
          <p className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider mb-3">Total Barang</p>
          <p className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{totalItems}</p>
        </div>
        <div className="glass-card rounded-2xl p-6 group">
          <p className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider mb-3">Dipinjam</p>
          <p className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{activeBorrows}</p>
        </div>
        <div className="glass-card rounded-2xl p-6 group">
          <p className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider mb-3">Perbaikan</p>
          <p className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{activeRepairs}</p>
        </div>
        <div className="glass-card rounded-2xl p-6 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[30px] rounded-full -z-10"></div>
          <p className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider mb-3">Stok Kritis</p>
          <p className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400">{lowStock + outOfStock}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel rounded-2xl flex flex-col">
          <div className="p-6 border-b border-white/10">
             <h3 className="font-display font-bold text-white uppercase text-lg tracking-wider">Peringatan Stok</h3>
          </div>
          <div className="p-6 flex-1 bg-white/[0.01]">
            <div className="space-y-4">
              {items.filter(i => i.stock <= 5).map(item => (
                <div key={item.id} className="flex justify-between items-center py-3 px-4 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{item.name}</p>
                    <p className="text-xs font-mono text-slate-500 mt-1">{item.sku}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    item.stock === 0 ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    SISA {item.stock}
                  </span>
                </div>
              ))}
              {items.filter(i => i.stock <= 5).length === 0 && (
                <div className="h-32 flex items-center justify-center border border-dashed border-white/20 rounded-xl bg-white/5">
                  <p className="text-slate-400 font-mono text-sm uppercase tracking-wider">Semua stok aman</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl flex flex-col">
          <div className="p-6 border-b border-white/10">
             <h3 className="font-display font-bold text-white uppercase text-lg tracking-wider">Perbaikan Terbaru</h3>
          </div>
          <div className="p-6 flex-1 bg-white/[0.01]">
            <div className="space-y-4">
               {repairs.slice(0, 3).map(repair => (
                 <div key={repair.id} className="py-4 px-4 bg-white/5 rounded-xl border border-white/5">
                   <div className="flex justify-between mb-2">
                     <p className="text-sm font-medium text-slate-200">{repair.itemName}</p>
                     <p className="text-[10px] font-mono font-bold bg-white/10 text-slate-300 px-2 py-0.5 rounded-md">#{repair.id}</p>
                   </div>
                   <p className="text-xs text-slate-400">{repair.description}</p>
                 </div>
               ))}
               {repairs.length === 0 && (
                 <div className="h-32 flex items-center justify-center border border-dashed border-white/20 rounded-xl bg-white/5">
                  <p className="text-slate-400 font-mono text-sm uppercase tracking-wider">Tidak ada perbaikan</p>
                </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
