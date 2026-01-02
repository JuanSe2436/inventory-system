import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { StockMovement } from '../models/stock-movement.model';

@Injectable({ providedIn: 'root' })
export class InventoryMockService {
  private products: Product[] = [
    { id: 1, sku: 'P-0001', name: 'Arroz 1kg', category: 'Abarrotes', price: 4500, cost: 3200, stock: 12, minStock: 5, active: true },
    { id: 2, sku: 'P-0002', name: 'Aceite 1L', category: 'Abarrotes', price: 14000, cost: 10500, stock: 3, minStock: 6, active: true },
    { id: 3, sku: 'P-0003', name: 'Jabón', category: 'Aseo', price: 3000, cost: 1800, stock: 25, minStock: 10, active: true },
    { id: 4, sku: 'P-0004', name: 'Papel higiénico', category: 'Aseo', price: 12000, cost: 8500, stock: 2, minStock: 8, active: true },
  ];

  private movements: StockMovement[] = [
    { id: 1, date: new Date().toISOString(), type: 'OUT', productId: 2, quantity: 2, note: 'Venta' },
    { id: 2, date: new Date().toISOString(), type: 'OUT', productId: 4, quantity: 1, note: 'Venta' },
    { id: 3, date: new Date().toISOString(), type: 'IN', productId: 1, quantity: 10, note: 'Compra' },
  ];

  getProducts(): Observable<Product[]> {
    return of(this.products.filter(p => p.active));
  }

  getMovements(): Observable<StockMovement[]> {
    return of(this.movements);
  }
}
