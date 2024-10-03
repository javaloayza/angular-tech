
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Producto } from './products-list.interface';
import { ProductsServiceTemp } from 'src/app/services/products-list.service';
import { Categories } from '../categories/categories.interface';

@Component({
  selector: 'app-product-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})

export class ProductListComponent implements OnInit {
  products: Producto[] = [];
  @Input() categories: Categories[] = [];
  @Output() productClick = new EventEmitter<string>;

  constructor(
    private productService: ProductsServiceTemp,
  ) { }

  ngOnInit(): void {
    this.fetchProducts();
    console.log(this.products)
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe(response => {
    // Procesar productos y agregar categoryName
    this.products = response.map((product:any ) => ({
      ...product,
      categoryName: this.getCategoryName(product.categoryId)
    }));
  });
}

getCategoryName(categoryId: string) {
    const category = this.categories.find(category => category.id === categoryId)
    return category ? category?.name : 'Categoría no encontrada'
  }

onProductClick(productId: string): void {
  return this.productClick.emit(productId)
}

}
