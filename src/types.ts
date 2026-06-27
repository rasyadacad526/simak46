export interface Item {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  status: 'Tersedia' | 'Stok Menipis' | 'Habis';
  lastUpdated: string;
}

export interface RepairTask {
  id: string;
  itemId: string;
  itemName: string;
  description: string;
  status: 'Menunggu' | 'Dikerjakan' | 'Selesai';
  dateReported: string;
}

export interface BorrowRecord {
  id: string;
  itemId: string;
  itemName: string;
  borrowerName: string;
  borrowDate: string;
  returnDate?: string;
  status: 'Dipinjam' | 'Dikembalikan';
}
