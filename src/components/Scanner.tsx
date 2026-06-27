import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Item } from '../types';

interface ScannerProps {
  items: Item[];
}

export default function Scanner({ items }: ScannerProps) {
  const [scannedSku, setScannedSku] = useState('');
  const [scannedItem, setScannedItem] = useState<Item | null>(null);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedSku) return;
    const found = items.find(i => i.sku === scannedSku);
    setScannedItem(found || null);
  };

  return (
    <div className="h-full flex flex-col space-y-6 max-w-2xl mx-auto w-full pt-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider text-gradient">Scanner Barcode</h2>
        <p className="text-sm font-mono font-medium text-slate-400 mt-2 uppercase tracking-wider">Scan atau masukkan kode barang secara manual</p>
      </div>

      <div className="glass-panel rounded-3xl p-8">
        <form onSubmit={handleScan} className="space-y-6">
          <div>
            <label className="block text-xs font-mono font-medium text-slate-400 mb-2 uppercase tracking-wider">SKU / Barcode</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text"
                autoFocus
                placeholder="Contoh: 899999900001"
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder-slate-500"
                value={scannedSku}
                onChange={(e) => setScannedSku(e.target.value)}
              />
            </div>
          </div>
          <button 
            type="submit"
            disabled={!scannedSku}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:hover:from-blue-600 disabled:hover:to-purple-600 text-white py-3 rounded-xl font-display font-bold text-lg uppercase transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] border border-white/10 tracking-wider disabled:shadow-none"
          >
            Cari Barang
          </button>
        </form>

        <div className="mt-10 border-t border-white/10 pt-8">
          <h4 className="text-xs font-mono font-medium text-slate-400 mb-6 uppercase tracking-widest">Hasil Scan</h4>
          
          {scannedItem ? (
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[30px] rounded-full -z-10"></div>
              <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
                <div>
                  <h5 className="text-xl font-display font-bold text-white uppercase tracking-wide">{scannedItem.name}</h5>
                  <p className="font-mono text-sm text-slate-400 mt-1">{scannedItem.sku}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase font-mono rounded-md tracking-wider">
                  Ditemukan
                </span>
              </div>
              <div className="mt-4 flex gap-8">
                <div>
                  <span className="font-mono text-[10px] font-medium uppercase text-slate-500 block mb-1 tracking-wider">Kategori</span>
                  <span className="font-medium text-slate-200">{scannedItem.category}</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] font-medium uppercase text-slate-500 block mb-1 tracking-wider">Stok</span>
                  <span className="font-bold text-white">{scannedItem.stock}</span>
                </div>
              </div>
            </div>
          ) : scannedItem === null && scannedSku ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
              <p className="font-display font-bold text-white uppercase text-lg tracking-wider">Barang tidak ditemukan</p>
              <p className="font-mono text-sm mt-2 text-slate-400">Barcode "{scannedSku}" belum terdaftar.</p>
            </div>
          ) : (
            <div className="h-32 border border-dashed border-white/20 rounded-2xl bg-white/5 flex items-center justify-center">
              <p className="text-slate-500 font-mono text-sm uppercase tracking-wider">Silakan scan barang</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
