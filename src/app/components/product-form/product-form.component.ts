import { Categories } from './../../pages/categories/categories.interface';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Producto } from 'src/app/pages/products-list/products-list.interface';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
    description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    image: ['', [
      Validators.required,
      // Validators.pattern(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)
    ]],
    price: ['', [Validators.required, Validators.min(1)]],
    categoryId: ['', Validators.required]
  });

  categories: Categories[] = [];
  @Output() productCreated = new EventEmitter<Producto>();

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService
  ) {}


  ngOnInit(): void {
    this.fetchCategories();
  }


  crearProducto(): void {
    this.productCreated.emit(this.productForm.value)
  }

  fetchCategories(): void {
    this.categoriesService.getCategories().subscribe((response: any) => {
      this.categories = response;
    })
  }


}


