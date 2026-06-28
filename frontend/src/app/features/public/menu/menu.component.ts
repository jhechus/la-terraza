import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { MenuService } from '../../../core/services/menu.service';
import { Category, Product } from '../../../core/models/menu.model';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  private menuService = inject(MenuService);
  private title = inject(Title);

  categories = signal<Category[]>([]);
  allProducts = signal<Product[]>([]);
  activeCategory = signal<number | null>(null);
  loading = signal(true);

  ngOnInit() {
    this.title.setTitle('Menú | La Terraza');
    this.menuService.getCategories().subscribe(cats => {
      this.categories.set(cats.filter(c => c.activa));
      if (cats.length) this.activeCategory.set(cats[0].id);
    });
    this.menuService.getProducts().subscribe(products => {
      this.allProducts.set(products.filter(p => p.disponible));
      this.loading.set(false);
    });
  }

  get filteredProducts(): Product[] {
    const catId = this.activeCategory();
    if (!catId) return this.allProducts();
    return this.allProducts().filter(p => p.categoriaId === catId);
  }

  selectCategory(id: number) {
    this.activeCategory.set(id);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);
  }

  getImageUrl(imagen: string | undefined | null): string {
    if (!imagen) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
    if (imagen.startsWith('http')) return imagen;
    return `${environment.apiUrl}${imagen}`;
  }
}
