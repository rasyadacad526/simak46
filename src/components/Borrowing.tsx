import React from 'react';
import { Plus } from 'lucide-react';
import { BorrowRecord } from '../types';

interface BorrowingProps {
  borrows: BorrowRecord[];
}

export default function Borrowing({ borrows }: BorrowingProps) {
  return (
    <div className="h-full flex flex-col space-y-6 relative">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider text-gradient">Peminjaman Barang</h2>
          <p className="text-sm font-mono font-medium text-slate-400 mt-2 uppercase tracking-wider">Kelola data peminjaman barang</p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2.5 font-bold font-mono text-sm uppercase transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center gap-2 rounded-xl border border-white/10">
          <Plus size={18} />
          Pinjam Barang
        </button>
      </div>

      <div className="glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-white/5 sticky top-0 border-b border-white/10 z-10 backdrop-blur-md">
              <tr>
                <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs">Peminjam</th>
                <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs">Barang</th>
                <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs">Tanggal Pinjam</th>
                <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs">Tanggal Kembali</th>
                <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs">Status</th>
                <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {borrows.map(record => (
                <tr key={record.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 px-6 font-medium text-slate-200">{record.borrowerName}</td>
                  <td className="py-4 px-6 text-slate-400">{record.itemName}</td>
                  <td className="py-4 px-6 font-mono text-slate-500">{new Date(record.borrowDate).toLocaleDateString('id-ID')}</td>
                  <td className="py-4 px-6 font-mono text-slate-500">
                    {record.returnDate ? new Date(record.returnDate).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      record.status === 'Dikembalikan' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    {record.status === 'Dipinjam' && (
                      <button className="text-blue-400 hover:text-blue-300 font-mono font-bold text-xs uppercase transition-colors">Kembalikan</button>
                    )}
                  </td>
                </tr>
              ))}
              {borrows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <p className="font-mono font-medium text-slate-500 uppercase tracking-wider text-sm">Tidak ada data peminjaman</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
