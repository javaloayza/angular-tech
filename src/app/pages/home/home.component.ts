import { Component, OnInit } from '@angular/core';
import { Categories } from '../categories/categories.interface';
import { CategoriesService } from '../../services/categories.service'
import { Producto } from '../products-list/products-list.interface';
import { ProductsServiceTemp } from 'src/app/services/products-list.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  categories: Categories[] = [];
  showForm: boolean = false;
  searchTerm: string = '';

  constructor(
    private categoriesService: CategoriesService,
    private productServiceTemp: ProductsServiceTemp
  ) {}

  ngOnInit():void {
    this.fetchCategories();
    console.log('HomeComp', this.categories)
  }

  fetchCategories(): void {
    this.categoriesService.getCategories().subscribe((response: any)=> {
      this.categories= response;
      }
    )
  }

  handlerProductClick(productId:string) {
    console.log('click from the child', productId)
  }

  handlerProductCreated(producto: Producto) {
    this.productServiceTemp.createProduct(producto).subscribe({
      next: (response: any)=> {
        console.log('response', response)
        this.showForm = false;
      },
      error: (error: any) => {
        console.error('Error creating product', error)
      }
    })
  }

}
