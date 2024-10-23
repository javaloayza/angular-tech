import { Categories } from './../../pages/categories/categories.interface';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Producto } from 'src/app/pages/products-list/products-list.interface';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit, AfterViewInit {

  @ViewChild('nameInput') nameInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('priceInput') priceInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('productFormRef') formRef!: ElementRef<HTMLFormElement>;

  productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
    description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    image: ['', [Validators.required,// Validators.pattern(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)
      ]],
    price: ['', [Validators.required, Validators.min(1)]],
    categoryId: ['', Validators.required]
  });

  @Input() categories: Categories[] = [];
  @Output() productCreated = new EventEmitter<Producto>();

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService
  ) {}


  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    console.log('Referencia al input de nombre:', this.nameInputRef.nativeElement);
    console.log('Referencia al input de precio:', this.priceInputRef.nativeElement);
    console.log('Referencia al formulario completo:', this.formRef.nativeElement);
  }


  crearProducto(): void {
    if(this.productForm.valid){
      this.productCreated.emit(this.productForm.value)
      this.resetFormWithFocus();
    } else {
      this.focusFirstErrorField();
    }
  }

  private focusFirstErrorField(): void {
    const fieldToCheck = [
      { controlName: 'name', elementRef: this.nameInputRef },
      { controlName: 'price', elementRef: this.priceInputRef },
    ]

    for (const field of fieldToCheck) {
      const control = this.productForm.get(field.controlName);
      if (control && control.invalid) {
        control.markAsTouched();
        field.elementRef.nativeElement.focus();
        field.elementRef.nativeElement.classList.add('error-highlight')

        setTimeout(() => {
          field.elementRef.nativeElement.classList.remove('error-highlight')
        }, 3000);
        break
      }
    }
  }

  private resetFormWithFocus(): void{
    this.productForm.reset();
    this.nameInputRef.nativeElement.focus();
    console.log('Formulario limpiado y listo para el siguiente producto');
  }
  // fetchCategories(): void {
  //   this.categoriesService.getCategories().subscribe((response: any) => {
  //     this.categories = response;
  //   })
  // }


}


