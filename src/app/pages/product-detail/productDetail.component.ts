import { ProductsService } from './../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../products/products.interface';

@Component({
  selector: 'app-product-detail',
  templateUrl: './productDetail.component.html',
  styleUrls: ['./productDetail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  id: string = '';
  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      console.log(this.id);

      this.productsService.getProduct(this.id).subscribe({
        next: (product: any) => {
          this.product = product;
          console.log('product', this.product);
        },
        error: (error) => {
          if (error.status === 404) {
            console.log('Product not found');
          }
        },
      });
    });
  }
}
