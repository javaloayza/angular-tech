import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Product } from '../pages/products/products.interface';

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
          res.push(product)
        })
        return res;
      })
    )
  }
}
