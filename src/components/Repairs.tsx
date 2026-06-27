import React from 'react';
import { Plus } from 'lucide-react';
import { RepairTask } from '../types';

interface RepairsProps {
  repairs: RepairTask[];
}

export default function Repairs({ repairs }: RepairsProps) {
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Perbaikan Barang</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
          <Plus size={16} />
          Catat Perbaikan
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg flex-1 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 font-medium text-gray-700">Nama Barang</th>
              <th className="py-3 px-4 font-medium text-gray-700">Masalah</th>
              <th className="py-3 px-4 font-medium text-gray-700">Tanggal</th>
              <th className="py-3 px-4 font-medium text-gray-700">Status</th>
              <th className="py-3 px-4 font-medium text-gray-700 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {repairs.map(repair => (
              <tr key={repair.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">{repair.itemName}</td>
                <td className="py-3 px-4 text-gray-600">{repair.description}</td>
                <td className="py-3 px-4 text-gray-500">{new Date(repair.dateReported).toLocaleDateString('id-ID')}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    repair.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                    repair.status === 'Dikerjakan' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {repair.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">Update</button>
                </td>
              </tr>
            ))}
            {repairs.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  Tidak ada data perbaikan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
