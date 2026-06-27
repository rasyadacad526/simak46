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
    <div className="h-full flex flex-col space-y-4 max-w-2xl mx-auto w-full pt-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Scanner Barcode</h2>
        <p className="text-sm text-gray-500">Scan atau masukkan kode barang secara manual.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <form onSubmit={handleScan} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU / Barcode</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text"
                autoFocus
                placeholder="Contoh: 899999900001"
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={scannedSku}
                onChange={(e) => setScannedSku(e.target.value)}
              />
            </div>
          </div>
          <button 
            type="submit"
            disabled={!scannedSku}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2 rounded-md font-medium text-sm transition-colors"
          >
            Cari Barang
          </button>
        </form>

        <div className="mt-8 border-t border-gray-100 pt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Hasil Scan</h4>
          
          {scannedItem ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="font-semibold text-gray-900">{scannedItem.name}</h5>
                  <p className="text-gray-500 text-sm">{scannedItem.sku}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                  Ditemukan
                </span>
              </div>
              <div className="mt-4 flex gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block">Kategori</span>
                  <span className="font-medium text-gray-900">{scannedItem.category}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Stok</span>
                  <span className="font-medium text-gray-900">{scannedItem.stock}</span>
                </div>
              </div>
            </div>
          ) : scannedItem === null && scannedSku ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="font-medium text-red-800">Barang tidak ditemukan</p>
              <p className="text-red-600 text-sm mt-1">Barcode "{scannedSku}" belum terdaftar.</p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">Silakan scan barang.</p>
          )}
        </div>
      </div>
    </div>
  );
}
