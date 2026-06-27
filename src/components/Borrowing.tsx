import React from 'react';
import { Plus } from 'lucide-react';
import { BorrowRecord } from '../types';

interface BorrowingProps {
  borrows: BorrowRecord[];
}

export default function Borrowing({ borrows }: BorrowingProps) {
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Peminjaman Barang</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
          <Plus size={16} />
          Pinjam Barang
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg flex-1 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 font-medium text-gray-700">Peminjam</th>
              <th className="py-3 px-4 font-medium text-gray-700">Barang</th>
              <th className="py-3 px-4 font-medium text-gray-700">Tanggal Pinjam</th>
              <th className="py-3 px-4 font-medium text-gray-700">Tanggal Kembali</th>
              <th className="py-3 px-4 font-medium text-gray-700">Status</th>
              <th className="py-3 px-4 font-medium text-gray-700 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {borrows.map(record => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">{record.borrowerName}</td>
                <td className="py-3 px-4 text-gray-600">{record.itemName}</td>
                <td className="py-3 px-4 text-gray-500">{new Date(record.borrowDate).toLocaleDateString('id-ID')}</td>
                <td className="py-3 px-4 text-gray-500">
                  {record.returnDate ? new Date(record.returnDate).toLocaleDateString('id-ID') : '-'}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    record.status === 'Dikembalikan' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  {record.status === 'Dipinjam' && (
                    <button className="text-green-600 hover:text-green-800 font-medium">Kembalikan</button>
                  )}
                </td>
              </tr>
            ))}
            {borrows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  Tidak ada data peminjaman.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
