export type MovementType = 'IN' | 'OUT' | 'ADJUST';

export interface StockMovement {
  id: number;
  date: string; // ISO
  type: MovementType;
  productId: number;
  quantity: number;
  note?: string;
}
