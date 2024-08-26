import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import { CartService } from '../services/cart.service';  // Asegúrate de tener el servicio adecuado para manejar el carrito

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  // cartItemsCount: number = 0;

  // constructor(private cartService: CartService, private router: Router) {
  //   this.cartService.cart$.subscribe(cart => {
  //     this.cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  //   });
  // }

  // navigateToCart() {
  //   this.router.navigate(['/cart']);
  // }
}
