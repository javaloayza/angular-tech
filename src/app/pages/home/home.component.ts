import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Categories } from '../categories/categories.interface';
import { CategoriesService } from '../../services/categories.service'
import { Producto } from '../products-list/products-list.interface';
import { ProductsServiceTemp } from 'src/app/services/products-list.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();

  categories: Categories[] = [];
  showForm: boolean = false;
  searchTerm: string = '';
  reloadTrigger: boolean = false;

  constructor(
    private categoriesService: CategoriesService,
    private productServiceTemp: ProductsServiceTemp,
    private router: Router
  ) {}

  ngOnInit():void {
    this.fetchCategories();
    console.log('HomeComp', this.categories)
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchCategories(): void {
    this.categoriesService.getCategories()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((response: any)=> {
        this.categories= response;
    })
  }

  handlerProductClick(productId:string) {
    this.router.navigate(['/product', productId])
    console.log('click from the child', productId)
  }

  handlerProductCreated(producto: Producto) {
    this.productServiceTemp.createProduct(producto)
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (response: any)=> {
        console.log('response', response)
        this.showForm = false;
        this.reloadTrigger = !this.reloadTrigger;
      },
      error: (error: any) => {
        console.error('Error creating product', error)
      }
    })
  }

}
