import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent },

      // próximos módulos:
      // { path: 'products', loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent) },
      // { path: 'movements', loadComponent: () => import('./features/movements/movements.component').then(m => m.MovementsComponent) },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
