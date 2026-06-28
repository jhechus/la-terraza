export type ReservationStatus = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA';

export interface Reservation {
  id: number;
  nombreCliente: string;
  telefono: string;
  correo?: string;
  fecha: string;
  hora: string;
  personas: number;
  comentarios?: string;
  estado: ReservationStatus;
  notaAdmin?: string;
  createdAt: string;
}

export interface CreateReservationDto {
  nombreCliente: string;
  telefono: string;
  correo?: string;
  fecha: string;
  hora: string;
  personas: number;
  comentarios?: string;
}

export interface ReservationStats {
  total: number;
  pendientes: number;
  confirmadas: number;
  hoy: number;
}
