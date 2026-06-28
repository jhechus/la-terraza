import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ReservationService } from '../../../core/services/reservation.service';

@Component({
  selector: 'app-reservations',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss',
})
export class ReservationsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private reservationService = inject(ReservationService);
  private title = inject(Title);

  loading = signal(false);
  submitted = signal(false);
  error = signal<string | null>(null);

  timeSlots = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00',
  ];

  form = this.fb.group({
    nombreCliente: ['', [Validators.required, Validators.minLength(2)]],
    telefono:      ['', [Validators.required, Validators.pattern(/^[\d\s\+\-()]{7,15}$/)]],
    correo:        ['', Validators.email],
    fecha:         ['', Validators.required],
    hora:          ['', Validators.required],
    personas:      [2, [Validators.required, Validators.min(1), Validators.max(20)]],
    comentarios:   [''],
  });

  get minDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    this.title.setTitle('Reservaciones | La Terraza');
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const value = this.form.value;
    this.reservationService.create({
      nombreCliente: value.nombreCliente!,
      telefono:      value.telefono!,
      correo:        value.correo || undefined,
      fecha:         value.fecha!,
      hora:          value.hora!,
      personas:      Number(value.personas),
      comentarios:   value.comentarios || undefined,
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.submitted.set(true);
        this.form.reset({ personas: 2 });
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Hubo un error al enviar tu reservación. Por favor intenta de nuevo.');
      },
    });
  }

  hasError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  resetForm() {
    this.submitted.set(false);
    this.form.reset({ personas: 2 });
  }
}
