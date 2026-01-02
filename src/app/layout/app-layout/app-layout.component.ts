import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarModule, MenubarModule, ButtonModule],
  template: `
    <p-menubar [model]="topMenu" styleClass="app-menubar">
      <ng-template pTemplate="start">
        <button pButton type="button" icon="pi pi-bars" class="p-button-text" (click)="sidebarOpen = true"></button>
        <span class="brand">Inventario</span>
      </ng-template>

      <ng-template pTemplate="end">
        <span class="user-chip">
          <i class="pi pi-user"></i>
          <span>Admin</span>
        </span>
      </ng-template>
    </p-menubar>

    <p-sidebar [(visible)]="sidebarOpen" position="left" [showCloseIcon]="true">
      <h3 class="sidebar-title">Menú</h3>

      <div class="sidebar-links">
        <a routerLink="/dashboard" (click)="sidebarOpen=false">
          <i class="pi pi-chart-bar"></i> Dashboard
        </a>

        <a routerLink="/products" (click)="sidebarOpen=false">
          <i class="pi pi-box"></i> Productos
        </a>

        <a routerLink="/movements" (click)="sidebarOpen=false">
          <i class="pi pi-arrows-v"></i> Movimientos
        </a>
      </div>
    </p-sidebar>

    <main class="content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .app-menubar { border-radius: 0; }
    .brand { margin-left: .75rem; font-weight: 600; font-size: 1.05rem; }
    .content { padding: 1rem; }
    .sidebar-title { margin-top: 0; }
    .sidebar-links { display: flex; flex-direction: column; gap: .75rem; }
    .sidebar-links a { text-decoration: none; color: inherit; display: flex; gap: .5rem; align-items: center; }
    .user-chip { display: inline-flex; gap: .5rem; align-items: center; opacity: .9; }
  `]
})
export class AppLayoutComponent {
  sidebarOpen = false;

  topMenu: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: '/dashboard' },
    { label: 'Productos', icon: 'pi pi-box', routerLink: '/products' },
    { label: 'Movimientos', icon: 'pi pi-arrows-v', routerLink: '/movements' },
  ];
}
