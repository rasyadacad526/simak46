import { Item, RepairTask, BorrowRecord, User } from './types';

export const initialUsers: User[] = [
  { id: '1', name: 'Admin Utama', email: 'admin@simak46.com', password: 'password123', role: 'Admin', createdAt: new Date().toISOString() },
  { id: '2', name: 'Staff Gudang', email: 'staff@simak46.com', password: 'password123', role: 'Staff', createdAt: new Date().toISOString() },
];

export const initialItems: Item[] = [];

export const initialRepairs: RepairTask[] = [];

export const initialBorrows: BorrowRecord[] = [];
