import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';

import { InventoryMockService } from '../../../Core/services/inventory-mock.service';
import { Product } from '../../../Core/models/product.model';
import { StockMovement } from '../../../Core/models/stock-movement.model';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, TagModule, ChartModule],
  template: `
    <div class="grid">
      <p-card class="kpi">
        <div class="kpi-title">Productos activos</div>
        <div class="kpi-value">{{ totalProducts }}</div>
      </p-card>

      <p-card class="kpi">
        <div class="kpi-title">Stock total (unidades)</div>
        <div class="kpi-value">{{ totalStock }}</div>
      </p-card>

      <p-card class="kpi">
        <div class="kpi-title">Stock bajo</div>
        <div class="kpi-value">{{ lowStockCount }}</div>
      </p-card>

      <p-card class="kpi">
        <div class="kpi-title">Movimientos hoy</div>
        <div class="kpi-value">{{ todayMovements }}</div>
      </p-card>
    </div>

    <div class="grid-2">
      <p-card header="Stock por categoría">
        <p-chart type="bar" [data]="stockByCategoryData"></p-chart>
      </p-card>

      <p-card header="Movimientos por tipo">
        <p-chart type="doughnut" [data]="movementTypeData"></p-chart>
      </p-card>
    </div>

    <p-card header="Productos con stock bajo" styleClass="mt">
      <p-table [value]="lowStockProducts" [paginator]="true" [rows]="5" responsiveLayout="scroll">
        <ng-template pTemplate="header">
          <tr>
            <th>SKU</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Mínimo</th>
            <th>Estado</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-p>
          <tr>
            <td>{{ p.sku }}</td>
            <td>{{ p.name }}</td>
            <td>{{ p.category }}</td>
            <td>{{ p.stock }}</td>
            <td>{{ p.minStock }}</td>
            <td>
              <p-tag severity="danger" value="Bajo"></p-tag>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1rem;
    }
    .grid-2 {
      margin-top: 1rem;
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1rem;
    }
    .kpi { border-radius: 12px; }
    .kpi-title { opacity: .75; font-size: .9rem; }
    .kpi-value { font-size: 2rem; font-weight: 700; margin-top: .25rem; }
    .mt { margin-top: 1rem; }

    @media (max-width: 1024px) {
      .grid { grid-template-columns: repeat(2, 1fr); }
      .grid-2 { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  totalStock = 0;
  lowStockCount = 0;
  todayMovements = 0;

  lowStockProducts: Product[] = [];

  stockByCategoryData: any;
  movementTypeData: any;

  constructor(private inv: InventoryMockService) { }

  ngOnInit(): void {
    forkJoin({
      products: this.inv.getProducts(),
      movements: this.inv.getMovements()
    }).subscribe(({ products, movements }) => {
      this.computeKPIs(products, movements);
      this.buildCharts(products, movements);
    });
  }

  private computeKPIs(products: Product[], movements: StockMovement[]) {
    this.totalProducts = products.length;
    this.totalStock = products.reduce((acc, p) => acc + p.stock, 0);

    this.lowStockProducts = products.filter(p => p.stock <= p.minStock);
    this.lowStockCount = this.lowStockProducts.length;

    const today = new Date().toDateString();
    this.todayMovements = movements.filter(m => new Date(m.date).toDateString() === today).length;
  }

  private buildCharts(products: Product[], movements: StockMovement[]) {
    // Stock por categoría
    const byCat = new Map<string, number>();
    for (const p of products) {
      byCat.set(p.category, (byCat.get(p.category) ?? 0) + p.stock);
    }
    const catLabels = Array.from(byCat.keys());
    const catValues = Array.from(byCat.values());

    this.stockByCategoryData = {
      labels: catLabels,
      datasets: [
        { label: 'Unidades', data: catValues }
      ]
    };

    // Movimientos por tipo
    const types = { IN: 0, OUT: 0, ADJUST: 0 };
    for (const m of movements) types[m.type]++;

    this.movementTypeData = {
      labels: ['Entradas', 'Salidas', 'Ajustes'],
      datasets: [
        { data: [types.IN, types.OUT, types.ADJUST] }
      ]
    };
  }
}
