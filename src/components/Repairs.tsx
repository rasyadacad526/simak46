import React from 'react';
import { Plus } from 'lucide-react';
import { RepairTask } from '../types';

interface RepairsProps {
  repairs: RepairTask[];
}

export default function Repairs({ repairs }: RepairsProps) {
  return (
    <div className="h-full flex flex-col space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white uppercase tracking-wider text-gradient">Perbaikan Barang</h2>
          <p className="text-xs sm:text-sm font-mono font-medium text-slate-400 mt-2 uppercase tracking-wider">Kelola tiket perbaikan aset</p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2.5 font-bold font-mono text-sm uppercase transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center sm:justify-start gap-2 rounded-xl border border-white/10 w-full sm:w-auto">
          <Plus size={18} />
          Catat Perbaikan
        </button>
      </div>

      <div className="glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-auto">
          <div className="min-w-max">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-white/5 sticky top-0 border-b border-white/10 z-10 backdrop-blur-md">
                <tr>
                  <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs">Nama Barang</th>
                  <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs">Masalah</th>
                  <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs">Tanggal</th>
                  <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs">Status</th>
                  <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {repairs.map(repair => (
                  <tr key={repair.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4 px-6 font-medium text-slate-200">{repair.itemName}</td>
                    <td className="py-4 px-6 text-slate-400 max-w-xs truncate">{repair.description}</td>
                    <td className="py-4 px-6 font-mono text-slate-500">{new Date(repair.dateReported).toLocaleDateString('id-ID')}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        repair.status === 'Selesai' ? 'bg-emerald-500/20 text-emerald-300' :
                        repair.status === 'Dikerjakan' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-orange-500/20 text-orange-300'
                      }`}>
                        {repair.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-blue-400 hover:text-blue-300 font-mono font-bold text-xs uppercase transition-colors">Update</button>
                    </td>
                  </tr>
                ))}
                {repairs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <p className="font-mono font-medium text-slate-500 uppercase tracking-wider text-sm">Tidak ada data perbaikan</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
