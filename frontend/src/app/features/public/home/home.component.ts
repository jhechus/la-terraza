import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { MenuService } from '../../../core/services/menu.service';
import { Product, Category } from '../../../core/models/menu.model';
import { Restaurant } from '../../../core/models/restaurant.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private restaurantService = inject(RestaurantService);
  private menuService = inject(MenuService);
  private title = inject(Title);
  private meta = inject(Meta);

  restaurant = signal<Restaurant | null>(null);
  featuredProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);
  activeCategory = signal<number | null>(null);

  galleryImages = [
    { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', alt: 'Platillo estrella' },
    { src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&q=80', alt: 'Ambiente del lugar' },
    { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80', alt: 'Cócteles artesanales' },
    { src: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80', alt: 'Cortes de res' },
    { src: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=600&q=80', alt: 'Terraza exterior' },
    { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', alt: 'Postres' },
  ];

  ngOnInit() {
    this.restaurantService.get().subscribe(r => {
      this.restaurant.set(r);
      this.title.setTitle(`${r.nombre} | Restaurante Bar en ${r.ciudad}`);
      this.meta.updateTag({ name: 'description', content: r.metaDescripcion });
      this.meta.updateTag({ name: 'keywords', content: r.metaKeywords });
    });

    this.menuService.getFeaturedProducts().subscribe(products => {
      this.featuredProducts.set(products);
    });

    this.menuService.getCategories().subscribe(cats => {
      this.categories.set(cats.filter(c => c.activa));
      this.loading.set(false);
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);
  }

  getImageUrl(imagen: string | undefined | null): string {
    if (!imagen) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
    if (imagen.startsWith('http')) return imagen;
    return `${environment.apiUrl}${imagen}`;
  }
}
