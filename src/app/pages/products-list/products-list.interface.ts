export interface Producto {
  id?: string | null;
  name: string | null;
  price: number | null;
  description: string | null;
  image: string | null;
  categoryId?: string | null;
  categoryName: string | null;
}
