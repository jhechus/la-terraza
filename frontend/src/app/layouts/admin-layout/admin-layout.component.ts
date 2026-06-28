import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  sidebarOpen = signal(true);
  user = this.auth.currentUser;

  navItems = [
    { path: '/admin',             label: 'Dashboard',   icon: '📊', exact: true },
    { path: '/admin/menu',        label: 'Menú',         icon: '🍽️', exact: false },
    { path: '/admin/reservas',    label: 'Reservas',     icon: '📅', exact: false },
    { path: '/admin/configuracion', label: 'Configuración', icon: '⚙️', exact: false },
  ];

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  logout() {
    this.auth.logout();
  }

  goToSite() {
    this.router.navigate(['/']);
  }
}
