import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CreateReservationDto, Reservation, ReservationStats } from '../models/reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/reservations`;

  create(dto: CreateReservationDto) {
    return this.http.post<Reservation>(this.api, dto);
  }

  getAll(params?: { fecha?: string; estado?: string }) {
    let query = '';
    if (params?.fecha) query += `?fecha=${params.fecha}`;
    if (params?.estado) query += `${query ? '&' : '?'}estado=${params.estado}`;
    return this.http.get<Reservation[]>(`${this.api}${query}`);
  }

  getStats() {
    return this.http.get<ReservationStats>(`${this.api}/stats`);
  }

  updateStatus(id: number, data: { estado: string; notaAdmin?: string }) {
    return this.http.put<Reservation>(`${this.api}/${id}`, data);
  }
}
