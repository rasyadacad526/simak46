import React, { useState, useMemo } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, Trash2, Edit, X, Printer } from 'lucide-react';
import { RepairTask, Item } from '../types';
import Swal from 'sweetalert2';

interface RepairsProps {
  repairs: RepairTask[];
  setRepairs: React.Dispatch<React.SetStateAction<RepairTask[]>>;
  items: Item[];
}

export default function Repairs({ repairs, setRepairs, items }: RepairsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const itemsPerPage = 7;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRepair, setEditingRepair] = useState<RepairTask | null>(null);
  const [formData, setFormData] = useState({
    itemId: '',
    description: '',
    status: 'Menunggu' as RepairTask['status'],
    dateStarted: '',
  });

  const filteredRepairs = useMemo(() => {
    return repairs.filter(repair => 
      repair.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      repair.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [repairs, searchTerm]);

  const totalPages = Math.ceil(filteredRepairs.length / itemsPerPage);
  const paginatedRepairs = filteredRepairs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(paginatedRepairs.map(repair => repair.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const customSwal = Swal.mixin({
    customClass: {
      popup: 'bg-[#1e1e2d] border border-white/10 rounded-2xl text-slate-200',
      title: 'text-white font-display',
      htmlContainer: 'text-slate-400',
      confirmButton: 'bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-bold border border-white/10 ml-3',
      cancelButton: 'bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-bold border border-white/10',
    },
    buttonsStyling: false
  });

  const successSwal = Swal.mixin({
    customClass: {
      popup: 'bg-[#1e1e2d] border border-white/10 rounded-2xl text-slate-200',
      title: 'text-white font-display',
      htmlContainer: 'text-slate-400',
      confirmButton: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-bold border border-white/10',
    },
    buttonsStyling: false
  });

  const handleDelete = (id: string) => {
    customSwal.fire({
      title: 'Hapus Tiket Perbaikan?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        setRepairs(prev => prev.filter(repair => repair.id !== id));
        setSelectedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        successSwal.fire({
          title: 'Terhapus!',
          text: 'Tiket berhasil dihapus.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    });
  };

  const handleMultiDelete = () => {
    if (selectedIds.size === 0) return;
    
    customSwal.fire({
      title: `Hapus ${selectedIds.size} Tiket?`,
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus Semua!',
      cancelButtonText: 'Batal',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        setRepairs(prev => prev.filter(repair => !selectedIds.has(repair.id)));
        setSelectedIds(new Set());
        successSwal.fire({
          title: 'Terhapus!',
          text: `${selectedIds.size} tiket berhasil dihapus.`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    });
  };

  const openAddModal = () => {
    setEditingRepair(null);
    setFormData({ 
      itemId: '', 
      description: '', 
      status: 'Menunggu', 
      dateStarted: new Date().toISOString().split('T')[0] 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (repair: RepairTask) => {
    setEditingRepair(repair);
    setFormData({
      itemId: repair.itemId,
      description: repair.description,
      status: repair.status,
      dateStarted: repair.dateStarted ? new Date(repair.dateStarted).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.itemId) {
      customSwal.fire('Error', 'Pilih barang terlebih dahulu.', 'error');
      return;
    }

    const selectedItem = items.find(i => i.id === formData.itemId);
    const itemName = selectedItem ? selectedItem.name : 'Barang Tidak Diketahui';
    
    if (editingRepair) {
      setRepairs(prev => prev.map(repair => 
        repair.id === editingRepair.id 
          ? { 
              ...repair, 
              itemId: formData.itemId,
              description: formData.description,
              status: formData.status,
              itemName,
              dateStarted: formData.dateStarted ? new Date(formData.dateStarted).toISOString() : undefined
            }
          : repair
      ));
      successSwal.fire({ title: 'Tersimpan!', text: 'Perubahan berhasil disimpan.', icon: 'success', confirmButtonText: 'OK' });
    } else {
      const newRepair: RepairTask = {
        id: Math.random().toString(36).substr(2, 9),
        itemId: formData.itemId,
        itemName,
        description: formData.description,
        status: formData.status,
        dateReported: new Date().toISOString(),
        dateStarted: formData.dateStarted ? new Date(formData.dateStarted).toISOString() : new Date().toISOString()
      };
      setRepairs(prev => [newRepair, ...prev]);
      successSwal.fire({ title: 'Berhasil!', text: 'Tiket baru ditambahkan.', icon: 'success', confirmButtonText: 'OK' });
    }
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Laporan Perbaikan Barang</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #333; }
            h1 { text-align: center; margin-bottom: 5px; }
            p { text-align: center; margin-top: 0; color: #666; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f2f2f2; }
            @media print {
              @page { size: landscape; }
            }
          </style>
        </head>
        <body>
          <h1>Laporan Perbaikan Barang</h1>
          <p>Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')} | Total Tiket: ${repairs.length}</p>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Barang</th>
                <th>Masalah</th>
                <th>Tanggal Dilaporkan</th>
                <th>Awal Perbaikan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${repairs.map((repair, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${repair.itemName}</td>
                  <td>${repair.description}</td>
                  <td>${new Date(repair.dateReported).toLocaleDateString('id-ID')}</td>
                  <td>${repair.dateStarted ? new Date(repair.dateStarted).toLocaleDateString('id-ID') : '-'}</td>
                  <td>${repair.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="h-full flex flex-col space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white uppercase tracking-wider text-gradient">Perbaikan Barang</h2>
          <p className="text-xs sm:text-sm font-mono font-medium text-slate-400 mt-2 uppercase tracking-wider">Kelola tiket perbaikan aset</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button 
            onClick={handlePrint}
            className="bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 font-bold font-mono text-sm uppercase transition-all flex items-center gap-2 rounded-xl border border-white/10"
            title="Cetak Laporan (PDF)"
          >
            <Printer size={18} />
          </button>
          <button 
            onClick={openAddModal}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2.5 font-bold font-mono text-sm uppercase transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center sm:justify-start gap-2 rounded-xl border border-white/10 w-full sm:w-auto"
          >
            <Plus size={18} />
            Catat Perbaikan
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden relative">
        <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row gap-4 bg-white/[0.02] items-start sm:items-center justify-between">
          <div className="relative w-full sm:max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Cari barang atau masalah..."
              className="w-full pl-12 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder-slate-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          {selectedIds.size > 0 && (
            <button 
              onClick={handleMultiDelete}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 rounded-xl font-mono text-sm uppercase transition-colors border border-red-500/30 w-full sm:w-auto"
            >
              <Trash2 size={16} />
              Hapus ({selectedIds.size})
            </button>
          )}
        </div>

        <div className="flex-1 overflow-auto">
          <div className="min-w-max">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-white/5 sticky top-0 border-b border-white/10 z-10 backdrop-blur-md">
                <tr>
                  <th className="py-4 px-6 w-12">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500/50 focus:ring-offset-0"
                      checked={paginatedRepairs.length > 0 && selectedIds.size === paginatedRepairs.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs">Nama Barang</th>
                  <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs">Masalah</th>
                  <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs">Tanggal Lapor</th>
                  <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs">Awal Perbaikan</th>
                  <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs">Status</th>
                  <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedRepairs.map(repair => (
                  <tr key={repair.id} className={`hover:bg-white/[0.04] transition-colors group ${selectedIds.has(repair.id) ? 'bg-purple-500/5' : ''}`}>
                    <td className="py-4 px-6">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500/50 focus:ring-offset-0"
                        checked={selectedIds.has(repair.id)}
                        onChange={() => handleSelect(repair.id)}
                      />
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-200">{repair.itemName}</td>
                    <td className="py-4 px-6 text-slate-400 max-w-xs truncate">{repair.description}</td>
                    <td className="py-4 px-6 font-mono text-slate-500">{new Date(repair.dateReported).toLocaleDateString('id-ID')}</td>
                    <td className="py-4 px-6 font-mono text-slate-500">{repair.dateStarted ? new Date(repair.dateStarted).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        repair.status === 'Selesai' ? 'bg-emerald-500/20 text-emerald-300' :
                        repair.status === 'Dikerjakan' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-orange-500/20 text-orange-300'
                      }`}>
                        {repair.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(repair)} className="text-blue-400 hover:text-blue-300 font-mono font-bold text-xs uppercase transition-colors inline-flex items-center gap-1"><Edit size={14} /> Edit</button>
                      <button onClick={() => handleDelete(repair.id)} className="text-red-400 hover:text-red-300 font-mono font-bold text-xs uppercase transition-colors inline-flex items-center gap-1"><Trash2 size={14} /> Hapus</button>
                    </td>
                  </tr>
                ))}
                {paginatedRepairs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <p className="font-mono font-medium text-slate-500 uppercase tracking-wider text-sm">Tidak ada data perbaikan</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
          <p className="text-xs font-mono text-slate-400">
            Menampilkan {filteredRepairs.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredRepairs.length)} dari {filteredRepairs.length}
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-white/10 bg-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-lg border border-white/10 bg-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1e1e2d] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-xl font-display font-bold text-white uppercase tracking-wider">
                {editingRepair ? 'Edit Tiket Perbaikan' : 'Tambah Tiket Perbaikan'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium text-slate-400 mb-2 uppercase tracking-wider">Pilih Barang</label>
                <select 
                  required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white appearance-none"
                  value={formData.itemId} 
                  onChange={e => setFormData({...formData, itemId: e.target.value})}
                >
                  <option value="" disabled className="bg-[#1e1e2d]">Pilih Barang...</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id} className="bg-[#1e1e2d]">
                      {item.name} ({item.sku})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-mono font-medium text-slate-400 mb-2 uppercase tracking-wider">Deskripsi Masalah</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder-slate-500 resize-none"
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Deskripsikan kerusakan..."
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-slate-400 mb-2 uppercase tracking-wider">Tanggal Mulai Perbaikan</label>
                <input 
                  type="date" 
                  required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder-slate-500"
                  value={formData.dateStarted} 
                  onChange={e => setFormData({...formData, dateStarted: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-slate-400 mb-2 uppercase tracking-wider">Status</label>
                <select 
                  required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white appearance-none"
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value as RepairTask['status']})}
                >
                  <option value="Menunggu" className="bg-[#1e1e2d]">Menunggu</option>
                  <option value="Dikerjakan" className="bg-[#1e1e2d]">Dikerjakan</option>
                  <option value="Selesai" className="bg-[#1e1e2d]">Selesai</option>
                </select>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold border border-white/10 text-white hover:bg-white/10 transition-colors">
                  Batal
                </button>
                <button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2.5 rounded-xl font-bold border border-white/10 transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

