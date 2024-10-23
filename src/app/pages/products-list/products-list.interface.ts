export interface Producto {
  id?: string | null;
  name: string | null;
  price: number | null;
  description: string | null;
  image: string | null;
  categoryId?: string | null;
  categoryName: string | null;

  stock?: number;           // Para saber si hay inventario
  createdAt?: string;       // Para detectar productos nuevos
}
