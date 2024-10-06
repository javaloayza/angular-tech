import { Component, OnInit } from '@angular/core';
import { Categories } from '../categories/categories.interface';
import { CategoriesService } from '../../services/categories.service'
import { Producto } from '../products-list/products-list.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  categories: Categories[] = [];
  showForm: boolean = false;

  constructor(private categoriesService: CategoriesService) {}

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

  HandlerProductClick(event:any) {
    console.log('click from the child', event)
  }

  HandlerProductCreated(producto: Producto) {
    console.log('product created', producto);
    this.showForm = false;
  }
}
