import { Component, OnInit } from '@angular/core';
import { Categories } from '../categories/categories.interface';
import { CategoriesService } from '../../services/categories.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  categories: Categories[] = [];

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

  onHandlerProductClick(event:any) {
    console.log('click from the child', event)
  }
}
