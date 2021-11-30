import { Component, OnInit } from '@angular/core';

import { ProductService } from 'src/app/Services/product.service';
import { Product } from 'src/app/Services/product';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [MessageService]
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  productsToDisplay: Product[] = [];
  wishListItems: Product[] = [];
  cartItems: Product[] = [];
  filters: string[] = ['All', 'Less than $30', 'Less than $60', 'Less than $100'];
  selectedFilter: string = 'All';

  searchQuery: string = '';
  results: any[] = [];

  wlCount: number = 0;
  ctCount: number = 0;

  responsiveOptions = [
    {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
    },
    {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
    },
    {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
    }
  ];

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.productService.getProductsSmall().then(products => {
			this.products = products;
			this.productsToDisplay = products;
      console.log(this.productsToDisplay)
      if(this.auth.currentUserValue.jwtToken) {
        this.productService.getWishlist().subscribe(
          (res) => {
            console.log(res);
            this.wishListItems = res;
            this.products.forEach((item1) => {
              this.wishListItems.forEach((item2: any) => {
                if(item1.id == item2.id) {
                  item1.inwishlist = 'true';
                }
              })
            })
            this.wlCount = this.wishListItems.length;
            this.productService.updateWishList(this.wlCount);
          }, (err) => {
            console.log(err);
          }
        );
        this.productService.getCartlist().subscribe(
          (res) => {
            console.log(res);
            this.cartItems = res;
            this.products.forEach((item1) => {
              this.cartItems.forEach((item2: any) => {
                if(item1.id == item2.id) {
                  item1.incart = 'true';
                }
              })
            })
            this.ctCount = this.cartItems.length;
            this.productService.updateCart(this.ctCount);
          }, (err) => {
            console.log(err);
          }
        );
      } else {
        this.productService.updateWishList(null);
        this.productService.updateCart(null);
      }
		});
  }

  addToWishList(product: Product) {
    console.log(this.auth.currentUserValue.jwtToken)
    if(!this.auth.currentUserValue.jwtToken) {
      this.showToast();
      return
    }
    console.log(product)
    this.wishListItems.push(product);
    product.inwishlist = 'true';
    this.wlCount++;
    localStorage.setItem("wishlist", JSON.stringify(this.wishListItems));
    this.productService.updatewl(product).subscribe(
      (res) => {
        console.log(res);
        this.productService.updateWishList(this.wlCount);
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Wishlist updated'});
      }, (err) => {
        console.log(err);
      }
    );
    console.log(product);
  }

  addToCart(product: Product) {
    console.log(this.auth.currentUserValue.jwtToken)
    if(!this.auth.currentUserValue.jwtToken) {
      this.showToast();
      return
    }
    console.log(product)
    this.cartItems.push(product);
    product.incart = 'true';
    this.ctCount++;
    localStorage.setItem("cart", JSON.stringify(this.cartItems));
    this.productService.updatect(product).subscribe(
      (res) => {
        console.log(res);
        this.productService.updateCart(this.ctCount);
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Cart updated'});
      }, (err) => {
        console.log(err);
      }
    );
    console.log(product);
  }

  filterChanged(event: any) {
    console.log(event.value)
    if(event.value == 'All') {
      this.productsToDisplay = this.products;
    } else if(event.value == 'Less than $30') {
      this.productsToDisplay = this.products.filter((item: any) => item.price < 30 );
    } else if(event.value == 'Less than $60') {
      this.productsToDisplay = this.products.filter((item: any) => item.price < 60);
    } else {
      this.productsToDisplay = this.products.filter((item: any) => item.price < 100);
    }
  }

  // search(event: any) {
  //   console.log(event.query);
  //   if(event.query.length >= 1) {
  //     this.productService.searchQuery(event.query).subscribe(
  //       (res) => {
  //         console.log(res);
  //       }, (err) => {
  //         console.log(err);
  //       }
  //     );
  //   }
  // }

  showToast() {
    this.messageService.add({severity:'warn', summary: 'Login', detail: 'Login required'});
  }

}
