import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../../../core/services/reservation.service';
import { MenuService } from '../../../core/services/menu.service';
import { ReservationStats } from '../../../core/models/reservation.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private menuService = inject(MenuService);

  stats = signal<ReservationStats | null>(null);
  totalProducts = signal(0);
  featuredProducts = signal(0);
  recentReservations = signal<any[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.reservationService.getStats().subscribe(s => this.stats.set(s));

    this.menuService.getProducts().subscribe(products => {
      this.totalProducts.set(products.filter(p => p.disponible).length);
      this.featuredProducts.set(products.filter(p => p.destacado).length);
    });

    this.reservationService.getAll().subscribe(reservations => {
      this.recentReservations.set(reservations.slice(0, 5));
      this.loading.set(false);
    });
  }

  getStatusClass(estado: string): string {
    const map: Record<string, string> = {
      PENDIENTE:  'badge-warning',
      CONFIRMADA: 'badge-success',
      CANCELADA:  'badge-danger',
      COMPLETADA: 'badge-muted',
    };
    return map[estado] || 'badge-muted';
  }

  getStatusLabel(estado: string): string {
    const map: Record<string, string> = {
      PENDIENTE:  'Pendiente',
      CONFIRMADA: 'Confirmada',
      CANCELADA:  'Cancelada',
      COMPLETADA: 'Completada',
    };
    return map[estado] || estado;
  }
}
