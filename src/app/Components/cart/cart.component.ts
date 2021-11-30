import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/Services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartlist: any[] = [];

  constructor(
    private product: ProductService
  ) { }

  ngOnInit(): void {
    this.product.getCartlist().subscribe(
      (res) => {
        console.log(res);
        this.cartlist = res;
      }, (err) => {
        console.log(err);
      }
    );
  }

}
