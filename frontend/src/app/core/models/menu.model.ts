export interface Category {
  id: number;
  nombre: string;
  icono?: string;
  orden: number;
  activa: boolean;
  _count?: { products: number };
  products?: Product[];
}

export interface Product {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen?: string;
  disponible: boolean;
  destacado: boolean;
  orden: number;
  categoriaId: number;
  categoria?: { id: number; nombre: string };
}
