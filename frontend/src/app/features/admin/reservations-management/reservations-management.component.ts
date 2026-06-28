import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation, ReservationStatus } from '../../../core/models/reservation.model';

@Component({
  selector: 'app-reservations-management',
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './reservations-management.component.html',
  styleUrl: './reservations-management.component.scss',
})
export class ReservationsManagementComponent implements OnInit {
  private reservationService = inject(ReservationService);

  reservations = signal<Reservation[]>([]);
  loading = signal(true);
  filterEstado = signal('');
  selected = signal<Reservation | null>(null);
  updatingId = signal<number | null>(null);

  statusOptions: { value: string; label: string }[] = [
    { value: '',           label: 'Todos los estados' },
    { value: 'PENDIENTE',  label: 'Pendientes' },
    { value: 'CONFIRMADA', label: 'Confirmadas' },
    { value: 'CANCELADA',  label: 'Canceladas' },
    { value: 'COMPLETADA', label: 'Completadas' },
  ];

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    const estado = this.filterEstado();
    this.reservationService.getAll(estado ? { estado } : {}).subscribe(data => {
      this.reservations.set(data);
      this.loading.set(false);
    });
  }

  onFilterChange() {
    this.load();
  }

  select(r: Reservation) {
    this.selected.set(r);
  }

  closeDetail() {
    this.selected.set(null);
  }

  updateStatus(id: number, estado: ReservationStatus) {
    this.updatingId.set(id);
    this.reservationService.updateStatus(id, { estado }).subscribe({
      next: () => {
        this.updatingId.set(null);
        if (this.selected()?.id === id) this.selected.update(r => r ? { ...r, estado } : null);
        this.load();
      },
      error: () => this.updatingId.set(null),
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
