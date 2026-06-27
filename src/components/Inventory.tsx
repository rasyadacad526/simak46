import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Item } from '../types';

interface InventoryProps {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

export default function Inventory({ items, setItems }: InventoryProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.sku.includes(searchTerm)
  );

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Katalog Barang</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
          <Plus size={16} />
          Tambah Barang
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Cari barang atau SKU..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 sticky top-0 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 font-medium text-gray-700">SKU</th>
                <th className="py-3 px-4 font-medium text-gray-700">Nama Barang</th>
                <th className="py-3 px-4 font-medium text-gray-700">Kategori</th>
                <th className="py-3 px-4 font-medium text-gray-700">Stok</th>
                <th className="py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="py-3 px-4 font-medium text-gray-700 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-500">{item.sku}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{item.name}</td>
                  <td className="py-3 px-4 text-gray-600">{item.category}</td>
                  <td className="py-3 px-4 text-gray-900">{item.stock}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.status === 'Tersedia' ? 'bg-green-100 text-green-700' :
                      item.status === 'Stok Menipis' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-3">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                    <button className="text-red-600 hover:text-red-800 font-medium">Hapus</button>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Tidak ada barang ditemukan.
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
