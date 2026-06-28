import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { MenuService } from '../../../core/services/menu.service';
import { Category, Product } from '../../../core/models/menu.model';

@Component({
  selector: 'app-menu-management',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './menu-management.component.html',
  styleUrl: './menu-management.component.scss',
})
export class MenuManagementComponent implements OnInit {
  private menuService = inject(MenuService);
  private fb = inject(FormBuilder);

  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);
  activeTab = signal<'products' | 'categories'>('products');
  activeCategory = signal<number | null>(null);
  loading = signal(true);
  saving = signal(false);
  uploadingImage = signal(false);
  showProductForm = signal(false);
  showCategoryForm = signal(false);
  editingProduct = signal<Product | null>(null);
  editingCategory = signal<Category | null>(null);

  // URL de imagen actual mientras edita/crea
  imagePreview = signal<string | null>(null);

  productForm = this.fb.group({
    nombre:      ['', Validators.required],
    descripcion: [''],
    precio:      [0, [Validators.required, Validators.min(0)]],
    categoriaId: [null as number | null, Validators.required],
    disponible:  [true],
    destacado:   [false],
    imagen:      ['' as string | null],
  });

  categoryForm = this.fb.group({
    nombre: ['', Validators.required],
    icono:  ['🍽️'],
    orden:  [0],
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.menuService.getCategories().subscribe(cats => {
      this.categories.set(cats);
      if (cats.length && !this.activeCategory()) this.activeCategory.set(cats[0].id);
    });
    this.menuService.getProducts().subscribe(prods => {
      this.products.set(prods);
      this.loading.set(false);
    });
  }

  get filteredProducts(): Product[] {
    const catId = this.activeCategory();
    if (!catId) return this.products();
    return this.products().filter(p => p.categoriaId === catId);
  }

  openProductForm(product?: Product) {
    this.editingProduct.set(product || null);
    if (product) {
      this.productForm.patchValue({
        nombre:      product.nombre,
        descripcion: product.descripcion || '',
        precio:      product.precio,
        categoriaId: product.categoriaId,
        disponible:  product.disponible,
        destacado:   product.destacado,
        imagen:      product.imagen || null,
      });
      this.imagePreview.set(product.imagen ? this.resolveImageUrl(product.imagen) : null);
    } else {
      this.productForm.reset({ disponible: true, destacado: false, precio: 0, categoriaId: this.activeCategory(), imagen: null });
      this.imagePreview.set(null);
    }
    this.showProductForm.set(true);
  }

  closeProductForm() {
    this.showProductForm.set(false);
    this.editingProduct.set(null);
    this.imagePreview.set(null);
    this.productForm.reset({ disponible: true, destacado: false, precio: 0, imagen: null });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];

    // Mostrar preview local inmediato
    const reader = new FileReader();
    reader.onload = (e) => this.imagePreview.set(e.target?.result as string);
    reader.readAsDataURL(file);

    // Subir al servidor
    this.uploadingImage.set(true);
    this.menuService.uploadImage(file).subscribe({
      next: (res) => {
        this.productForm.patchValue({ imagen: res.url });
        this.uploadingImage.set(false);
      },
      error: () => {
        this.uploadingImage.set(false);
        alert('Error al subir la imagen. Intenta de nuevo.');
      },
    });
  }

  removeImage() {
    this.imagePreview.set(null);
    this.productForm.patchValue({ imagen: null });
  }

  resolveImageUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${environment.apiUrl}${url}`;
  }

  saveProduct() {
    if (this.productForm.invalid) { this.productForm.markAllAsTouched(); return; }
    if (this.uploadingImage()) return; // espera a que termine la subida
    this.saving.set(true);
    const value = this.productForm.value;
    const editing = this.editingProduct();

    const obs = editing
      ? this.menuService.updateProduct(editing.id, value as any)
      : this.menuService.createProduct(value as any);

    obs.subscribe({
      next: () => { this.saving.set(false); this.closeProductForm(); this.loadData(); },
      error: () => this.saving.set(false),
    });
  }

  deleteProduct(id: number) {
    if (!confirm('¿Eliminar este producto?')) return;
    this.menuService.deleteProduct(id).subscribe(() => this.loadData());
  }

  toggleProductDisponible(product: Product) {
    this.menuService.updateProduct(product.id, { disponible: !product.disponible }).subscribe(() => this.loadData());
  }

  toggleProductDestacado(product: Product) {
    this.menuService.updateProduct(product.id, { destacado: !product.destacado }).subscribe(() => this.loadData());
  }

  openCategoryForm(cat?: Category) {
    this.editingCategory.set(cat || null);
    if (cat) {
      this.categoryForm.patchValue({ nombre: cat.nombre, icono: cat.icono || '🍽️', orden: cat.orden });
    } else {
      this.categoryForm.reset({ icono: '🍽️', orden: 0 });
    }
    this.showCategoryForm.set(true);
  }

  closeCategoryForm() {
    this.showCategoryForm.set(false);
    this.editingCategory.set(null);
    this.categoryForm.reset({ icono: '🍽️', orden: 0 });
  }

  saveCategory() {
    if (this.categoryForm.invalid) { this.categoryForm.markAllAsTouched(); return; }
    this.saving.set(true);
    const value = this.categoryForm.value;
    const editing = this.editingCategory();

    const obs = editing
      ? this.menuService.updateCategory(editing.id, value as any)
      : this.menuService.createCategory(value as any);

    obs.subscribe({
      next: () => { this.saving.set(false); this.closeCategoryForm(); this.loadData(); },
      error: () => this.saving.set(false),
    });
  }

  deleteCategory(id: number) {
    if (!confirm('¿Eliminar esta categoría y todos sus productos?')) return;
    this.menuService.deleteCategory(id).subscribe(() => this.loadData());
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);
  }

  getProductImageUrl(imagen: string | undefined): string {
    if (!imagen) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&q=70';
    return this.resolveImageUrl(imagen);
  }
}
