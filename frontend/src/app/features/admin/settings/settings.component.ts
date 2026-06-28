import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { Restaurant } from '../../../core/models/restaurant.model';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  private restaurantService = inject(RestaurantService);
  private fb = inject(FormBuilder);

  loading = signal(true);
  saving = signal(false);
  saved = signal(false);
  restaurant = signal<Restaurant | null>(null);

  form = this.fb.group({
    nombre:         ['', Validators.required],
    slogan:         [''],
    descripcion:    [''],
    direccion:      [''],
    telefono:       [''],
    whatsapp:       [''],
    correo:         ['', Validators.email],
    ciudad:         [''],
    pais:           [''],
    colorPrimario:  ['#1a1a2e'],
    colorSecundario:['#c9a84c'],
    colorAcento:    ['#e94560'],
    metaDescripcion:[''],
    metaKeywords:   [''],
    instagram:      [''],
    facebook:       [''],
    tiktok:         [''],
    // Horarios
    martes_apertura: ['13:00'], martes_cierre: ['23:00'],
    miercoles_apertura: ['13:00'], miercoles_cierre: ['23:00'],
    jueves_apertura: ['13:00'], jueves_cierre: ['23:30'],
    viernes_apertura: ['13:00'], viernes_cierre: ['01:00'],
    sabado_apertura: ['12:00'], sabado_cierre: ['01:00'],
    domingo_apertura: ['12:00'], domingo_cierre: ['22:00'],
  });

  ngOnInit() {
    this.restaurantService.get().subscribe(r => {
      this.restaurant.set(r);
      this.form.patchValue({
        nombre:          r.nombre,
        slogan:          r.slogan,
        descripcion:     r.descripcion,
        direccion:       r.direccion,
        telefono:        r.telefono,
        whatsapp:        r.whatsapp,
        correo:          r.correo,
        ciudad:          r.ciudad,
        pais:            r.pais,
        colorPrimario:   r.colorPrimario,
        colorSecundario: r.colorSecundario,
        colorAcento:     r.colorAcento,
        metaDescripcion: r.metaDescripcion,
        metaKeywords:    r.metaKeywords,
        instagram:       r.redesSociales?.instagram || '',
        facebook:        r.redesSociales?.facebook || '',
        tiktok:          r.redesSociales?.tiktok || '',
        martes_apertura: (r.horarios as any)?.martes?.apertura || '13:00',
        martes_cierre:   (r.horarios as any)?.martes?.cierre || '23:00',
        miercoles_apertura: (r.horarios as any)?.miercoles?.apertura || '13:00',
        miercoles_cierre:   (r.horarios as any)?.miercoles?.cierre || '23:00',
        jueves_apertura:  (r.horarios as any)?.jueves?.apertura || '13:00',
        jueves_cierre:    (r.horarios as any)?.jueves?.cierre || '23:30',
        viernes_apertura: (r.horarios as any)?.viernes?.apertura || '13:00',
        viernes_cierre:   (r.horarios as any)?.viernes?.cierre || '01:00',
        sabado_apertura:  (r.horarios as any)?.sabado?.apertura || '12:00',
        sabado_cierre:    (r.horarios as any)?.sabado?.cierre || '01:00',
        domingo_apertura: (r.horarios as any)?.domingo?.apertura || '12:00',
        domingo_cierre:   (r.horarios as any)?.domingo?.cierre || '22:00',
      });
      this.loading.set(false);
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.saving.set(true);
    this.saved.set(false);

    const v = this.form.value;
    const payload: Partial<Restaurant> = {
      nombre:          v.nombre!,
      slogan:          v.slogan!,
      descripcion:     v.descripcion!,
      direccion:       v.direccion!,
      telefono:        v.telefono!,
      whatsapp:        v.whatsapp!,
      correo:          v.correo!,
      ciudad:          v.ciudad!,
      pais:            v.pais!,
      colorPrimario:   v.colorPrimario!,
      colorSecundario: v.colorSecundario!,
      colorAcento:     v.colorAcento!,
      metaDescripcion: v.metaDescripcion!,
      metaKeywords:    v.metaKeywords!,
      redesSociales: {
        instagram: v.instagram || '',
        facebook:  v.facebook  || '',
        tiktok:    v.tiktok    || '',
      },
      horarios: {
        lunes:     { abierto: false },
        martes:    { abierto: true, apertura: v.martes_apertura, cierre: v.martes_cierre },
        miercoles: { abierto: true, apertura: v.miercoles_apertura, cierre: v.miercoles_cierre },
        jueves:    { abierto: true, apertura: v.jueves_apertura, cierre: v.jueves_cierre },
        viernes:   { abierto: true, apertura: v.viernes_apertura, cierre: v.viernes_cierre },
        sabado:    { abierto: true, apertura: v.sabado_apertura, cierre: v.sabado_cierre },
        domingo:   { abierto: true, apertura: v.domingo_apertura, cierre: v.domingo_cierre },
      } as any,
    };

    this.restaurantService.update(payload).subscribe({
      next: () => { this.saving.set(false); this.saved.set(true); setTimeout(() => this.saved.set(false), 3000); },
      error: () => this.saving.set(false),
    });
  }
}
