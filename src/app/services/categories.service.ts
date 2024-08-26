import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  url: string = "https://ecommerce-tec-default-rtdb.firebaseio.com";

  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get(`${this.url}/categories.json`).pipe(
      map((response: any) => {
        const res: any[] = [];
        Object.keys(response).forEach(key => {
          const category: any = response[key];
          category.id = key;
          res.push(category);
        });
        return res;
      })
    );
  }

  addCategory(category: any) {
    return this.http.post(`${this.url}/categories.json`, category);
  }

  updateCategory(category: any) {
    return this.http.put(`${this.url}/categories/${category.id}.json`, category);
  }

  deleteCategory(id: any) {
    return this.http.delete(`${this.url}/categories/${id}.json`);
  }
}
