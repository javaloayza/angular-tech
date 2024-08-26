import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  // url: string = "https://fakestoreapi.com/products";
  url: string = "https://ecommerce-tec-default-rtdb.firebaseio.com";


  constructor(private http: HttpClient) { }

  getProducts() {
    // return this.http.get(`${this.url}.json`).pipe(
      return this.http.get(`${this.url}/products.json`).pipe(
      map((response: any) => {
        const res: any[] = [];
        Object.keys(response).forEach(key => {
          const product: any = response[key];
          product.id = key;
          res.push(product);
        });
        return res;
      })
    );
  }

  addProduct(product: any) {
    return this.http.post(`${this.url}/products.json`, product);
  }

  getProduct(id: any) {
    // return this.http.get(`${this.url}/${id}.json`);
    return this.http.get(`${this.url}/products/${id}/.json`);
  }

  updateProduct(product: any) {
    // return this.http.put(`${this.url}/${product.id}.json`, product);
    return this.http.put(`${this.url}/products/${product.id}.json`, product);
  }

  deleteProduct(id: any) {
    return this.http.delete(`${this.url}/products/${id}.json`);
  }
  //////////////////////////////
  getCategories() {
    return this.http.get(`${this.url}/categories.json`).pipe(
      map((response: any) => {
        const res: any[] = [];
        Object.keys(response).forEach(key => {
          res.push({
            id: key,
            name: response[key].name
          });
        });
        return res;
      })
    );
  }


}
