
import { Component, EventEmitter, Input, OnInit, OnChanges, Output, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Producto } from './products-list.interface';
import { ProductsServiceTemp } from 'src/app/services/products-list.service';
import { Categories } from '../categories/categories.interface';
import { debounceTime, distinctUntilChanged, finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush //(SKIP - solo revisa si @Input() cambia)
})

export class ProductListComponent implements OnInit, OnChanges, OnDestroy {
  // Crear el "interruptor"
  private destroy$: Subject<void> = new Subject<void>();
  private searchSubject: Subject<string> = new Subject<string>();

  products: Producto[] = [];
  filteredProducts: Producto[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  @Input() categories: Categories[] = []; //obtiene categories del parent
  @Input() searchTerm: string = ''
  @Output() productClick = new EventEmitter<string>;  //emite productClick al parent
  @Input() reloadTrigger: boolean = false;

  constructor(
    private productService: ProductsServiceTemp,
    private  cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchProducts();
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {this.filterProducts(searchTerm)
      this.cdr.markForCheck();
    })
  }

  ngOnChanges(): void {
    if (this.reloadTrigger) {
      this.fetchProducts();
    }

    if (this.categories.length > 0 && this.products.length > 0) {
    this.products = this.products.map(product => ({
      ...product,
      categoryName: this.getCategoryName(product.categoryId || '')
    }));
  }

    this.searchSubject.next(this.searchTerm)
    console.log('🔄 ProductList change detection ejecutada');
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // ¡CANCELA TODO!
    this.destroy$.complete(); // Cierra el interruptor
  }

  fetchProducts(): void {
    this.errorMessage = null;
    this.isLoading = true;
    this.cdr.markForCheck();
    this.productService.getProducts()
    .pipe(
      finalize(() => {
        this.isLoading = false
        this.cdr.markForCheck();
      }),
      // Suscribirse Y decir "cancela cuando destroy$ emita"
      takeUntil(this.destroy$)
    )
    .subscribe({
    next: (response:any ) => {
    // Procesar productos y agregar categoryName
    this.products = response.map((product:any ) => ({
      ...product,
      categoryName: this.getCategoryName(product.categoryId)
    }));
    this.filteredProducts = this.products;
    this.cdr.markForCheck();
  },
    error: (error: any) => {
      this.errorMessage = 'No se pudo obtener los datos de los productos';
      this.cdr.markForCheck();
    }
  });
}

  filterProducts(searchTerm: string):void {
    if(!searchTerm.trim()) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product =>  product.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
      console.log('📦 filteredProducts cambiaron:', this.filteredProducts.length);
  }

  getCategoryName(categoryId: string) {
      const category = this.categories.find(category => category.id === categoryId)
      return category ? category?.name : 'Categoría no encontrada'
    }

  onProductClick(productId: string): void {
    return this.productClick.emit(productId)
  }

  clearSearch(): void {
    this.filteredProducts = this.products;
    this.searchTerm = '';
  }

  trackByProductId(index: number, product: Producto): string {
    return product.id || index.toString();
  }

  /** for ngClass */

    isNewProduct(product: Producto): boolean {
    if (!product.createdAt) return false;

    const createdDate = new Date(product.createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 7; // Nuevo si fue creado en los últimos 7 días
  }

  // Método para obtener clases del precio
  getPriceClasses(price: number): any {
    return {
      'text-success': price <= 100,      // Verde para precios bajos
      'text-warning': price > 100 && price <= 300, // Amarillo para precios medios
      'text-danger': price > 300       // Rojo para precios altos
    };
  }

  // Método para obtener clases de la tarjeta
  getCardClasses(product: Producto): any {
    return {
      'card-premium': product.price! > 100,
      'card-budget': product.price! <= 50,
      'card-out-of-stock': product.stock === 0,
      'card-new': this.isNewProduct(product) && product.stock !== 0
    };
  }

  // Método para obtener clases de la imagen
  getImageClasses(product: Producto): any {
    return {
      'img-premium': product.price! > 100,
      'img-grayscale': product.stock === 0
    };
  }

}
