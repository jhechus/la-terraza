import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/public/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'menu',
        loadComponent: () =>
          import('./features/public/menu/menu.component').then(m => m.MenuComponent),
      },
      {
        path: 'reservaciones',
        loadComponent: () =>
          import('./features/public/reservations/reservations.component').then(m => m.ReservationsComponent),
      },
      {
        path: 'nosotros',
        loadComponent: () =>
          import('./features/public/about/about.component').then(m => m.AboutComponent),
      },
      {
        path: 'contacto',
        loadComponent: () =>
          import('./features/public/contact/contact.component').then(m => m.ContactComponent),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/public/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'menu',
        loadComponent: () =>
          import('./features/admin/menu-management/menu-management.component').then(m => m.MenuManagementComponent),
      },
      {
        path: 'reservas',
        loadComponent: () =>
          import('./features/admin/reservations-management/reservations-management.component').then(m => m.ReservationsManagementComponent),
      },
      {
        path: 'configuracion',
        loadComponent: () =>
          import('./features/admin/settings/settings.component').then(m => m.SettingsComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
