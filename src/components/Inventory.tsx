import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, Trash2, Edit, X, Download, Upload } from 'lucide-react';
import { Item } from '../types';
import Swal from 'sweetalert2';

interface InventoryProps {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

export default function Inventory({ items, setItems }: InventoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const itemsPerPage = 7;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    stock: 0,
  });

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<string[]>(['Elektronik', 'Furnitur', 'Perangkat IT', 'Alat Tulis']);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const uniqueCats = new Set(items.map(i => i.category));
    setCategories(prev => {
      const newCats = [...prev];
      uniqueCats.forEach(c => {
        if (c && !newCats.includes(c)) newCats.push(c);
      });
      return newCats;
    });
  }, [items]);

  const generateSKU = (catName: string) => {
    const prefix = catName ? catName.substring(0, 3).toUpperCase() : 'ITM';
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${random}`;
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.sku.includes(searchTerm)
    );
  }, [items, searchTerm]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(paginatedItems.map(item => item.id)));
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
      title: 'Hapus Barang?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        setItems(prev => prev.filter(item => item.id !== id));
        setSelectedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        successSwal.fire({
          title: 'Terhapus!',
          text: 'Barang berhasil dihapus.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    });
  };

  const handleMultiDelete = () => {
    if (selectedIds.size === 0) return;
    
    customSwal.fire({
      title: `Hapus ${selectedIds.size} Barang?`,
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus Semua!',
      cancelButtonText: 'Batal',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        setItems(prev => prev.filter(item => !selectedIds.has(item.id)));
        setSelectedIds(new Set());
        successSwal.fire({
          title: 'Terhapus!',
          text: `${selectedIds.size} barang berhasil dihapus.`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    });
  };

  const handleEditCategory = (oldCat: string) => {
    customSwal.fire({
      title: 'Edit Kategori',
      input: 'text',
      inputValue: oldCat,
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      inputValidator: (value) => {
        if (!value) return 'Kategori tidak boleh kosong!';
        if (categories.includes(value) && value !== oldCat) return 'Kategori sudah ada!';
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newCat = result.value;
        setCategories(prev => prev.map(c => c === oldCat ? newCat : c));
        setItems(prev => prev.map(item => item.category === oldCat ? { ...item, category: newCat } : item));
        if (formData.category === oldCat) setFormData(prev => ({ ...prev, category: newCat }));
        successSwal.fire('Tersimpan!', 'Kategori berhasil diubah.', 'success');
      }
    });
  };

  const handleDeleteCategory = (cat: string) => {
    const isUsed = items.some(i => i.category === cat);
    if (isUsed) {
      customSwal.fire('Gagal!', 'Kategori sedang digunakan oleh barang.', 'error');
      return;
    }
    
    customSwal.fire({
      title: 'Hapus Kategori?',
      text: `Anda yakin ingin menghapus kategori "${cat}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        setCategories(prev => prev.filter(c => c !== cat));
        if (formData.category === cat) {
          const newCats = categories.filter(c => c !== cat);
          setFormData(prev => ({ ...prev, category: newCats.length > 0 ? newCats[0] : '' }));
        }
        successSwal.fire('Terhapus!', 'Kategori berhasil dihapus.', 'success');
      }
    });
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    if (categories.includes(newCategory.trim())) {
      customSwal.fire('Info', 'Kategori sudah ada.', 'info');
      return;
    }
    setCategories(prev => [...prev, newCategory.trim()]);
    setNewCategory('');
    successSwal.fire('Berhasil!', 'Kategori ditambahkan.', 'success');
  };

  const openAddModal = () => {
    setEditingItem(null);
    const defaultCat = categories[0] || '';
    setFormData({ sku: generateSKU(defaultCat), name: '', category: defaultCat, stock: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (item: Item) => {
    setEditingItem(item);
    setFormData({
      sku: item.sku,
      name: item.name,
      category: item.category,
      stock: item.stock
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for unique SKU
    const isDuplicate = items.some(item => item.sku === formData.sku && item.id !== editingItem?.id);
    if (isDuplicate) {
      customSwal.fire('Error', 'SKU sudah digunakan oleh barang lain! Silakan gunakan SKU yang unik.', 'error');
      return;
    }

    const status = formData.stock === 0 ? 'Habis' : (formData.stock <= 5 ? 'Stok Menipis' : 'Tersedia');
    
    if (editingItem) {
      setItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData, status, lastUpdated: new Date().toISOString() }
          : item
      ));
      successSwal.fire({ title: 'Tersimpan!', text: 'Perubahan berhasil disimpan.', icon: 'success', confirmButtonText: 'OK' });
    } else {
      const newItem: Item = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        status,
        lastUpdated: new Date().toISOString()
      };
      setItems(prev => [...prev, newItem]);
      successSwal.fire({ title: 'Berhasil!', text: 'Barang baru ditambahkan.', icon: 'success', confirmButtonText: 'OK' });
    }
    setIsModalOpen(false);
  };

  const handleExport = () => {
    const headers = ['SKU', 'Nama Barang', 'Kategori', 'Stok', 'Status', 'Last Updated'];
    const csvContent = [
      headers.join(','),
      ...filteredItems.map(item => [
        item.sku,
        `"${item.name.replace(/"/g, '""')}"`,
        `"${item.category}"`,
        item.stock,
        item.status,
        item.lastUpdated
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'katalog_barang.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        const lines = csvText.split('\n');
        
        const newItems: Item[] = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const regex = /(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^,]+))/g;
          let match;
          const values: string[] = [];
          
          while ((match = regex.exec(line)) !== null) {
            let val = match[1] || match[2] || '';
            if (val) {
              val = val.replace(/\"\"/g, '\"');
            }
            values.push(val);
          }

          if (values.length >= 4) {
            const stock = parseInt(values[3], 10) || 0;
            newItems.push({
              id: Math.random().toString(36).substr(2, 9),
              sku: values[0] || generateSKU(values[2] || ''),
              name: values[1] || 'Unknown Item',
              category: values[2] || 'Uncategorized',
              stock,
              status: stock === 0 ? 'Habis' : (stock <= 5 ? 'Stok Menipis' : 'Tersedia'),
              lastUpdated: new Date().toISOString()
            });
          }
        }

        if (newItems.length > 0) {
           customSwal.fire({
             title: 'Import Data',
             text: `Berhasil membaca ${newItems.length} barang dari file. Tambahkan ke data saat ini atau timpa semua data?`,
             icon: 'question',
             showDenyButton: true,
             showCancelButton: true,
             confirmButtonText: 'Tambahkan',
             denyButtonText: 'Timpa Semua',
             cancelButtonText: 'Batal',
           }).then((result) => {
             if (result.isConfirmed) {
               setItems(prev => [...prev, ...newItems]);
               successSwal.fire('Berhasil!', 'Data barang berhasil ditambahkan.', 'success');
             } else if (result.isDenied) {
               setItems(newItems);
               successSwal.fire('Berhasil!', 'Data barang berhasil ditimpa.', 'success');
             }
           });
        } else {
          customSwal.fire('Gagal', 'Tidak ada data valid yang bisa diimport. Pastikan format CSV sesuai.', 'error');
        }
      } catch (error) {
        customSwal.fire('Error', 'Terjadi kesalahan saat membaca file.', 'error');
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-full flex flex-col space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white uppercase tracking-wider text-gradient">Katalog Barang</h2>
          <p className="text-xs sm:text-sm font-mono font-medium text-slate-400 mt-2 uppercase tracking-wider">Kelola data inventaris</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef}
            onChange={handleImport}
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 font-bold font-mono text-sm uppercase transition-all flex items-center gap-2 rounded-xl border border-white/10"
            title="Import CSV"
          >
            <Upload size={18} />
          </button>
          <button 
            onClick={handleExport}
            className="bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 font-bold font-mono text-sm uppercase transition-all flex items-center gap-2 rounded-xl border border-white/10"
            title="Export CSV"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={openAddModal}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2.5 font-bold font-mono text-sm uppercase transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center gap-2 rounded-xl border border-white/10"
          >
            <Plus size={18} />
            Tambah Barang
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden relative">
        <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row gap-4 bg-white/[0.02] items-start sm:items-center justify-between">
          <div className="relative w-full sm:max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Cari barang atau SKU..."
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
                    checked={paginatedItems.length > 0 && selectedIds.size === paginatedItems.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs">SKU</th>
                <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs">Nama Barang</th>
                <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs">Kategori</th>
                <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs">Stok</th>
                <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs">Status</th>
                <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedItems.map(item => (
                <tr key={item.id} className={`hover:bg-white/[0.04] transition-colors group ${selectedIds.has(item.id) ? 'bg-purple-500/5' : ''}`}>
                  <td className="py-4 px-6">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500/50 focus:ring-offset-0"
                      checked={selectedIds.has(item.id)}
                      onChange={() => handleSelect(item.id)}
                    />
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-500">{item.sku}</td>
                  <td className="py-4 px-6 font-medium text-slate-200">{item.name}</td>
                  <td className="py-4 px-6 text-slate-400">{item.category}</td>
                  <td className="py-4 px-6 font-mono font-bold text-white">{item.stock}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'Tersedia' ? 'bg-emerald-500/20 text-emerald-300' :
                      item.status === 'Stok Menipis' ? 'bg-orange-500/20 text-orange-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(item)} className="text-blue-400 hover:text-blue-300 font-mono font-bold text-xs uppercase transition-colors inline-flex items-center gap-1"><Edit size={14} /> Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 font-mono font-bold text-xs uppercase transition-colors inline-flex items-center gap-1"><Trash2 size={14} /> Hapus</button>
                  </td>
                </tr>
              ))}
              {paginatedItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <p className="font-mono font-medium text-slate-500 uppercase tracking-wider text-sm">Tidak ada barang ditemukan</p>
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
            Menampilkan {filteredItems.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredItems.length)} dari {filteredItems.length}
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
                {editingItem ? 'Edit Barang' : 'Tambah Barang'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">SKU</label>
                  <button type="button" onClick={() => setFormData(p => ({ ...p, sku: generateSKU(p.category) }))} className="text-xs font-mono text-blue-400 hover:text-blue-300">Generate Ulang</button>
                </div>
                <input 
                  type="text" required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder-slate-500"
                  value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-medium text-slate-400 mb-2 uppercase tracking-wider">Nama Barang</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder-slate-500"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">Kategori</label>
                  <button type="button" onClick={() => setIsCatModalOpen(true)} className="text-xs font-mono text-purple-400 hover:text-purple-300">Kelola Kategori</button>
                </div>
                <select 
                  required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white appearance-none"
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value, sku: !editingItem ? generateSKU(e.target.value) : formData.sku})}
                >
                  <option value="" disabled className="bg-[#1e1e2d]">Pilih Kategori</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-[#1e1e2d]">{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono font-medium text-slate-400 mb-2 uppercase tracking-wider">Stok</label>
                <input 
                  type="number" required min="0"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder-slate-500"
                  value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                />
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

      {/* Modal Kategori */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1e1e2d] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-600"></div>
            
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-xl font-display font-bold text-white uppercase tracking-wider">
                Kelola Kategori
              </h3>
              <button onClick={() => setIsCatModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Kategori Baru..."
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder-slate-500"
                  value={newCategory} 
                  onChange={e => setNewCategory(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                />
                <button 
                  onClick={handleAddCategory}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-2.5 rounded-xl font-bold font-mono text-sm transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] border border-white/10"
                >
                  Tambah
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                {categories.map(cat => (
                  <div key={cat} className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded-xl group">
                    <span className="text-slate-200 font-medium">{cat}</span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditCategory(cat)} className="text-blue-400 hover:text-blue-300">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeleteCategory(cat)} className="text-red-400 hover:text-red-300">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {categories.length === 0 && (
                  <p className="text-center text-slate-500 text-sm py-4">Belum ada kategori.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

