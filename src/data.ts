import { Item, RepairTask, BorrowRecord, User } from './types';

export const initialUsers: User[] = [
  { id: '1', name: 'Admin Utama', email: 'admin@simak46.com', password: 'password123', role: 'Admin', createdAt: new Date().toISOString() },
  { id: '2', name: 'Staff Gudang', email: 'staff@simak46.com', password: 'password123', role: 'Staff', createdAt: new Date().toISOString() },
];

export const initialItems: Item[] = [
  { id: '1', sku: '899999900001', name: 'Laptop ThinkPad T14', category: 'Elektronik', stock: 15, status: 'Tersedia', location: 'Rak A1', lastUpdated: new Date().toISOString() },
  { id: '2', sku: '899999900002', name: 'Proyektor Epson', category: 'Elektronik', stock: 2, status: 'Stok Menipis', location: 'Rak A2', lastUpdated: new Date().toISOString() },
  { id: '3', sku: '899999900003', name: 'Kertas HVS A4', category: 'ATK', stock: 0, status: 'Habis', location: 'Lemari B1', lastUpdated: new Date().toISOString() },
  { id: '4', sku: '899999900004', name: 'Kursi Kantor', category: 'Furnitur', stock: 24, status: 'Tersedia', location: 'Gudang Utama', lastUpdated: new Date().toISOString() },
];

export const initialRepairs: RepairTask[] = [
  { id: '1', itemId: '2', itemName: 'Proyektor Epson', description: 'Lampu proyektor redup', status: 'Menunggu', dateReported: new Date().toISOString() },
];

export const initialBorrows: BorrowRecord[] = [
  { id: '1', itemId: '1', itemName: 'Laptop ThinkPad T14', borrowerName: 'Budi Santoso', borrowDate: new Date().toISOString(), status: 'Dipinjam' },
];
