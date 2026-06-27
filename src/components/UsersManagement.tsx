import React, { useState } from 'react';
import { User } from '../types';
import { Plus, Trash2, Edit, X, Lock } from 'lucide-react';
import Swal from 'sweetalert2';

interface UsersManagementProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentUser: User | null;
}

export default function UsersManagement({ users, setUsers, currentUser }: UsersManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Staff' as 'Admin' | 'Staff',
    password: ''
  });

  const [resetPassword, setResetPassword] = useState('');

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
    if (currentUser?.id === id) {
      customSwal.fire('Error', 'Tidak bisa menghapus akun sendiri!', 'error');
      return;
    }

    customSwal.fire({
      title: 'Hapus User?',
      text: "User yang dihapus tidak dapat mengakses sistem lagi!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(prev => prev.filter(user => user.id !== id));
        successSwal.fire('Terhapus!', 'User berhasil dihapus.', 'success');
      }
    });
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'Staff', password: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, password: '' });
    setIsModalOpen(true);
  };

  const openResetModal = (user: User) => {
    setEditingUser(user);
    setResetPassword('');
    setIsResetModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, name: formData.name, email: formData.email, role: formData.role } : u));
      successSwal.fire('Berhasil!', 'Data user diperbarui.', 'success');
    } else {
      if (!formData.password) {
        customSwal.fire('Error', 'Password wajib diisi untuk user baru!', 'error');
        return;
      }
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password,
        createdAt: new Date().toISOString()
      };
      setUsers(prev => [...prev, newUser]);
      successSwal.fire('Berhasil!', 'User baru ditambahkan.', 'success');
    }
    setIsModalOpen(false);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPassword) {
      customSwal.fire('Error', 'Password baru tidak boleh kosong!', 'error');
      return;
    }
    setUsers(prev => prev.map(u => u.id === editingUser?.id ? { ...u, password: resetPassword } : u));
    successSwal.fire('Berhasil!', 'Password berhasil direset.', 'success');
    setIsResetModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col space-y-6 relative">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider text-gradient">Manajemen User</h2>
          <p className="text-sm font-mono font-medium text-slate-400 mt-2 uppercase tracking-wider">Kelola akses sistem</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2.5 font-bold font-mono text-sm uppercase transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center gap-2 rounded-xl border border-white/10"
        >
          <Plus size={18} />
          Tambah User
        </button>
      </div>

      <div className="glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-white/5 sticky top-0 border-b border-white/10 z-10 backdrop-blur-md">
              <tr>
                <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs">Nama Lengkap</th>
                <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs">Email</th>
                <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs">Role</th>
                <th className="py-4 px-6 font-mono font-medium text-slate-400 uppercase tracking-wider text-xs text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-white/[0.04] transition-colors group">
                  <td className="py-4 px-6 font-medium text-slate-200">{user.name}</td>
                  <td className="py-4 px-6 font-mono text-slate-400">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'Admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openResetModal(user)} className="text-yellow-400 hover:text-yellow-300 font-mono font-bold text-xs uppercase transition-colors inline-flex items-center gap-1" title="Reset Password"><Lock size={14} /> Reset</button>
                    <button onClick={() => openEditModal(user)} className="text-blue-400 hover:text-blue-300 font-mono font-bold text-xs uppercase transition-colors inline-flex items-center gap-1"><Edit size={14} /> Edit</button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-300 font-mono font-bold text-xs uppercase transition-colors inline-flex items-center gap-1"><Trash2 size={14} /> Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1e1e2d] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-xl font-display font-bold text-white uppercase tracking-wider">
                {editingUser ? 'Edit User' : 'Tambah User'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium text-slate-400 mb-2 uppercase tracking-wider">Nama Lengkap</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder-slate-500"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-medium text-slate-400 mb-2 uppercase tracking-wider">Email</label>
                <input 
                  type="email" required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder-slate-500"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-medium text-slate-400 mb-2 uppercase tracking-wider">Role</label>
                <select 
                  required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white appearance-none"
                  value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as 'Admin' | 'Staff'})}
                >
                  <option value="Staff" className="bg-[#1e1e2d]">Staff</option>
                  <option value="Admin" className="bg-[#1e1e2d]">Admin</option>
                </select>
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-400 mb-2 uppercase tracking-wider">Password Default</label>
                  <input 
                    type="password" required
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white placeholder-slate-500"
                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              )}
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

      {isResetModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1e1e2d] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-600"></div>
            
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-xl font-display font-bold text-white uppercase tracking-wider">
                Reset Password
              </h3>
              <button onClick={() => setIsResetModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleResetSubmit} className="p-6 space-y-4">
              <p className="text-sm text-slate-400 font-mono mb-4">Mereset password untuk user: <strong className="text-white">{editingUser?.name}</strong></p>
              <div>
                <label className="block text-xs font-mono font-medium text-slate-400 mb-2 uppercase tracking-wider">Password Baru</label>
                <input 
                  type="password" required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-white placeholder-slate-500"
                  value={resetPassword} onChange={e => setResetPassword(e.target.value)}
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsResetModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold border border-white/10 text-white hover:bg-white/10 transition-colors">
                  Batal
                </button>
                <button type="submit" className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white px-6 py-2.5 rounded-xl font-bold border border-white/10 transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_25px_rgba(234,179,8,0.5)]">
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
