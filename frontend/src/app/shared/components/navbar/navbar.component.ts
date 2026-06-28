import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../../core/services/restaurant.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  private restaurantService = inject(RestaurantService);

  restaurantName = signal('La Terraza');
  scrolled = signal(false);
  menuOpen = signal(false);

  navLinks = [
    { path: '/',              label: 'Inicio',      exact: true },
    { path: '/menu',          label: 'Menú',        exact: false },
    { path: '/reservaciones', label: 'Reservar',    exact: false },
    { path: '/nosotros',      label: 'Nosotros',    exact: false },
    { path: '/contacto',      label: 'Contacto',    exact: false },
  ];

  ngOnInit() {
    this.restaurantService.get().subscribe(r => this.restaurantName.set(r.nombre));
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 60);
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}
