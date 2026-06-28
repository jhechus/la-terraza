import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { Restaurant } from '../../../core/models/restaurant.model';

@Component({
  selector: 'app-about',
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {
  private restaurantService = inject(RestaurantService);
  private title = inject(Title);
  restaurant = signal<Restaurant | null>(null);

  team = [
    { nombre: 'Chef Marco Reyes', rol: 'Chef Ejecutivo', img: 'https://images.unsplash.com/photo-1583394293214-0d00a1ee5b0b?w=400&q=80' },
    { nombre: 'Sofía Vega', rol: 'Sous Chef', img: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf0?w=400&q=80' },
    { nombre: 'Carlos Mora', rol: 'Bartender Principal', img: 'https://images.unsplash.com/photo-1567879760729-07dc64413ab8?w=400&q=80' },
  ];

  values = [
    { icon: '🌿', title: 'Ingredientes frescos', desc: 'Trabajamos con productores locales para garantizar la calidad de cada ingrediente.' },
    { icon: '🍷', title: 'Selección de vinos', desc: 'Una cava curada con las mejores etiquetas nacionales e internacionales.' },
    { icon: '🎨', title: 'Cocina de autor', desc: 'Cada platillo es una creación única que fusiona técnica clásica con sabores contemporáneos.' },
    { icon: '💫', title: 'Experiencia memorable', desc: 'Desde el servicio hasta el ambiente, cada detalle está pensado para que disfrutes al máximo.' },
  ];

  ngOnInit() {
    this.title.setTitle('Nosotros | La Terraza');
    this.restaurantService.get().subscribe(r => this.restaurant.set(r));
  }
}
