import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Product } from '../pages/products/products.interface';
import { Producto } from '../pages/products-list/products-list.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsServiceTemp {
  // url: string = "https://fakestoreapi.com/products";
  url: string = "https://ecommerce-tec-default-rtdb.firebaseio.com";

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get(`${this.url}/products.json`).pipe(
      map((response:any) => {
        const res: Product[] = [];
        Object.keys(response).forEach(key => {
          const product: any = response[key];
          product.id = key;

          // ✅ AGREGAR datos simulados para ngClass
          product.stock = Math.floor(Math.random() * 20); // Stock aleatorio 0-19
          product.createdAt = this.getRandomDate(); // Fecha aleatoria

          res.push(product)
        })
        return res;
      })
    )
  }

  // Método para generar fechas aleatorias (algunos productos "nuevos")
  private getRandomDate(): string {
    const today = new Date();
    const daysAgo = Math.floor(Math.random() * 30); // 0-30 días atrás
    const randomDate = new Date(today.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    return randomDate.toISOString();
  }

  createProduct(product:Producto){
    return this.http.post(`${this.url}/products.json`, product)
  }
}
