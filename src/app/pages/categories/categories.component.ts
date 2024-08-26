import { Component, OnInit } from '@angular/core';
import { CategoriesService } from './../../services/categories.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  selectedCategory: any = {};

  formCategory: FormGroup = this.fb.group({
    name: ['', [Validators.required]]
  });

  constructor(private categoriesService: CategoriesService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories() {
    this.categoriesService.getCategories().subscribe((response: any) => {
      this.categories = response;
    });
  }

  addCategory() {
    if (this.formCategory.valid) {
      const newCategory = { name: this.formCategory.value.name };
      this.categoriesService.addCategory(newCategory).subscribe(() => {
        this.fetchCategories();
        this.formCategory.reset();
      });
    } else {
      Swal.fire('Error', 'El nombre de la categoría es obligatorio.', 'error');
    }
  }

  editCategory() {
    const updatedCategory = {
      name: this.formCategory.value.name,
      id: this.selectedCategory.id
    };
    this.categoriesService.updateCategory(updatedCategory).subscribe(() => {
      this.fetchCategories();
      this.formCategory.reset();
    });
  }

  deleteCategory(id: any, index: number) {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'No podrá revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriesService.deleteCategory(id).subscribe({
          next: () => {
            this.categories.splice(index, 1);
            Swal.fire('¡Eliminado!', 'La categoría ha sido eliminada con éxito.', 'success');
            this.fetchCategories();
          },
          error: (error) => {
            Swal.fire('Error', 'No se pudo eliminar la categoría. Por favor, intente nuevamente.', 'error');
            console.error('Error eliminando la categoría:', error);
          },
        });
      }
    });
  }

  selectCategory(category: any) {
    this.selectedCategory = category;
    this.formCategory.patchValue({
      name: this.selectedCategory.name
    });
  }
}
