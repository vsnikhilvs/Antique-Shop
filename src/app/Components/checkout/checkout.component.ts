import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/Services/product.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

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
