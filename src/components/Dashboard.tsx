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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <p className="text-sm text-gray-500 font-medium">Total Barang</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{totalItems}</p>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <p className="text-sm text-gray-500 font-medium">Dipinjam</p>
          <p className="text-2xl font-semibold text-blue-600 mt-1">{activeBorrows}</p>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <p className="text-sm text-gray-500 font-medium">Perbaikan</p>
          <p className="text-2xl font-semibold text-amber-600 mt-1">{activeRepairs}</p>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <p className="text-sm text-gray-500 font-medium">Stok Kritis</p>
          <p className="text-2xl font-semibold text-red-600 mt-1">{lowStock + outOfStock}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
             <h3 className="font-semibold text-gray-900">Peringatan Stok</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {items.filter(i => i.stock <= 5).map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.sku}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    Sisa {item.stock}
                  </span>
                </div>
              ))}
              {items.filter(i => i.stock <= 5).length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">Semua stok aman.</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
             <h3 className="font-semibold text-gray-900">Perbaikan Terbaru</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
               {repairs.slice(0, 3).map(repair => (
                 <div key={repair.id} className="py-2 border-b border-gray-100 last:border-0">
                   <div className="flex justify-between">
                     <p className="text-sm font-medium text-gray-900">{repair.itemName}</p>
                     <p className="text-xs text-gray-500">#{repair.id}</p>
                   </div>
                   <p className="text-sm text-gray-600 mt-1">{repair.description}</p>
                 </div>
               ))}
               {repairs.length === 0 && (
                 <p className="text-gray-500 text-sm text-center py-4">Tidak ada perbaikan.</p>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
