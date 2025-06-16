// Table service with QR code generation and table management
import { Table } from '../types';

// Mock table data
const mockTables: Table[] = [
  { id: '1', number: 1, name: 'Window Table 1', seatCount: 2, status: 'available' },
  { id: '2', number: 2, name: 'Window Table 2', seatCount: 2, status: 'occupied' },
  { id: '3', number: 3, name: 'Corner Booth', seatCount: 4, status: 'available' },
  { id: '4', number: 4, name: 'Center Table 1', seatCount: 4, status: 'needs-service' },
  { id: '5', number: 5, name: 'Center Table 2', seatCount: 6, status: 'available' },
  { id: '6', number: 6, name: 'Bar Counter', seatCount: 8, status: 'occupied' },
  { id: '7', number: 7, name: 'Private Dining', seatCount: 10, status: 'needs-cleaning' },
  { id: '8', number: 8, name: 'Patio Table 1', seatCount: 4, status: 'available' }
];

export class TableService {
  // Get all tables for waiter/admin dashboard
  static async getAllTables(): Promise<Table[]> {
    return mockTables;
  }

  // Get specific table information
  static async getTable(tableId: string): Promise<Table | null> {
    return mockTables.find(table => table.id === tableId) || null;
  }

  // Update table status (waiter functionality)
  static async updateTableStatus(tableId: string, status: Table['status']): Promise<boolean> {
    const tableIndex = mockTables.findIndex(table => table.id === tableId);
    if (tableIndex === -1) return false;

    mockTables[tableIndex].status = status;
    console.log(`Table ${tableId} status updated to: ${status}`);
    return true;
  }

  // Generate QR code URL for table (placeholder)
  static generateQRCodeURL(tableId: string): string {
    // TODO: Integrate with actual QR code generation service
    const baseURL = window.location.origin;
    const qrData = `${baseURL}/guest?table=${tableId}`;
    
    // Using a placeholder QR code service - replace with actual implementation
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
  }

  // Admin functionality - add/edit/delete tables
  static async createTable(table: Omit<Table, 'id'>): Promise<Table> {
    const newTable: Table = {
      ...table,
      id: (mockTables.length + 1).toString()
    };
    mockTables.push(newTable);
    return newTable;
  }

  static async updateTable(tableId: string, updates: Partial<Table>): Promise<boolean> {
    const tableIndex = mockTables.findIndex(table => table.id === tableId);
    if (tableIndex === -1) return false;

    mockTables[tableIndex] = { ...mockTables[tableIndex], ...updates };
    return true;
  }

  static async deleteTable(tableId: string): Promise<boolean> {
    const tableIndex = mockTables.findIndex(table => table.id === tableId);
    if (tableIndex === -1) return false;

    mockTables.splice(tableIndex, 1);
    return true;
  }
}