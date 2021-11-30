import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/Services/product.service';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss']
})
export class WishListComponent implements OnInit {

  wishlist: any[] = [];

  constructor(
    private product: ProductService
  ) { }

  ngOnInit(): void {
    this.product.getWishlist().subscribe(
      (res) => {
        console.log(res);
        this.wishlist = res;
      }, (err) => {
        console.log(err);
      }
    );
  }

}
