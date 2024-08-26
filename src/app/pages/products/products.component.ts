import { Component, OnInit } from '@angular/core';
import { ProductsService } from './../../services/products.service';
import { CategoriesService } from './../../services/categories.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  id: any;
  products: any[] = [];
  categories: any[] = [];
  selectedProduct: any = {};

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required]],
    price: ['', [Validators.required, Validators.min(0)]],
    image: ['', [Validators.required]],
    categoryId: ['', [Validators.required]]
  });

  formEdit: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required]],
    price: ['', [Validators.required, Validators.min(0)]],
    image: ['', [Validators.required]],
    categoryId: ['', [Validators.required]]
  });

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.fetchProducts();
    this.fetchCategories(); // Obtener las categorías
  }

  fetchProducts() {
    this.productsService.getProducts().subscribe((response: any) => {
      this.products = response;
      console.log('fetchProducts', this.products);
    });
  }

  fetchCategories() {
    this.categoriesService.getCategories().subscribe((response: any) => {
      this.categories = response;
      console.log('fetchCategories', this.categories);
    });
  }

  addProduct() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    this.productsService.addProduct(this.form.value).subscribe(response => {
      console.log("Producto agregado exitosamente");
      this.fetchProducts();
      this.form.reset();
    });
  }

  selectProduct(id: any) {
    this.productsService.getProduct(id).subscribe((response: any) => {
      this.selectedProduct = response;
      this.id = id;
      console.log('selectedProduct', this.selectedProduct);
    });
  }

  editProduct(id: any) {
    if (!this.formEdit.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const updatedProduct = {
      ...this.formEdit.value,
      id: id
    };

    this.productsService.updateProduct(updatedProduct).subscribe(response => {
      this.fetchProducts();
    });
  }

  deleteProduct(id: any, index: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'No podrá revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productsService.deleteProduct(id).subscribe(
          () => {
            // Eliminar de la lista local
            this.products.splice(index, 1);

            Swal.fire(
              '¡Eliminado!',
              'El producto ha sido eliminado con éxito.',
              'success'
            );
          },
          (error) => {
            Swal.fire(
              'Error',
              'No se pudo eliminar el producto. Por favor, intente nuevamente.',
              'error'
            );
            console.error('Error eliminando el producto:', error);
          }
        );
      }
    });
  }


  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Sin categoría';
  }

}
