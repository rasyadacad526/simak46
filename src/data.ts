import { Item, RepairTask, BorrowRecord } from './types';

export const initialItems: Item[] = [
  { id: '1', sku: '899999900001', name: 'Laptop ThinkPad T14', category: 'Elektronik', stock: 15, status: 'Tersedia', lastUpdated: new Date().toISOString() },
  { id: '2', sku: '899999900002', name: 'Proyektor Epson', category: 'Elektronik', stock: 2, status: 'Stok Menipis', lastUpdated: new Date().toISOString() },
  { id: '3', sku: '899999900003', name: 'Kertas HVS A4', category: 'ATK', stock: 0, status: 'Habis', lastUpdated: new Date().toISOString() },
  { id: '4', sku: '899999900004', name: 'Kursi Kantor', category: 'Furnitur', stock: 24, status: 'Tersedia', lastUpdated: new Date().toISOString() },
];

export const initialRepairs: RepairTask[] = [
  { id: '1', itemId: '2', itemName: 'Proyektor Epson', description: 'Lampu proyektor redup', status: 'Menunggu', dateReported: new Date().toISOString() },
];

export const initialBorrows: BorrowRecord[] = [
  { id: '1', itemId: '1', itemName: 'Laptop ThinkPad T14', borrowerName: 'Budi Santoso', borrowDate: new Date().toISOString(), status: 'Dipinjam' },
];
