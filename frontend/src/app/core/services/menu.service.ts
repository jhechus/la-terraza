import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Category, Product } from '../models/menu.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getCategories() {
    return this.http.get<Category[]>(`${this.api}/categories`);
  }

  getCategoryWithProducts(id: number) {
    return this.http.get<Category>(`${this.api}/categories/${id}`);
  }

  createCategory(data: Partial<Category>) {
    return this.http.post<Category>(`${this.api}/categories`, data);
  }

  updateCategory(id: number, data: Partial<Category>) {
    return this.http.put<Category>(`${this.api}/categories/${id}`, data);
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.api}/categories/${id}`);
  }

  getProducts(params?: { categoriaId?: number; destacado?: boolean }) {
    let query = '';
    if (params?.categoriaId) query += `?categoriaId=${params.categoriaId}`;
    if (params?.destacado !== undefined) {
      query += query ? '&' : '?';
      query += `destacado=${params.destacado}`;
    }
    return this.http.get<Product[]>(`${this.api}/products${query}`);
  }

  getFeaturedProducts() {
    return this.http.get<Product[]>(`${this.api}/products/featured`);
  }

  createProduct(data: Partial<Product>) {
    return this.http.post<Product>(`${this.api}/products`, data);
  }

  updateProduct(id: number, data: Partial<Product>) {
    return this.http.put<Product>(`${this.api}/products/${id}`, data);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.api}/products/${id}`);
  }

  uploadImage(file: File) {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<{ url: string; filename: string }>(`${this.api}/uploads/image`, form);
  }
}
