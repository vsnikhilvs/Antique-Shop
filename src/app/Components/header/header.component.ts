import { Component, OnDestroy, OnInit } from '@angular/core';

import { ProductService } from 'src/app/Services/product.service';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  wlUpdate: any;
  cartUpdate: any;

  wlCount: string = '0';
  ctCount: string = '0';

  loggedIn: boolean = false;
  showLoginModal: boolean = false;

  email: string = '';
  password: string = '';
  submitted: boolean = false;

  constructor(
    private productService: ProductService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.auth.loggedout.subscribe(
      (res) => {
        console.log(res);
        if(res == 'out') {
          this.loggedIn = false;
        } else {
          if(this.auth.currentUserValue.jwtToken) {
            this.loggedIn = true;
          }
        }
      }
    );
    this.wlUpdate = this.productService.wishlistUpdate.subscribe(
      (res: any) => {
        console.log(res);
        this.wlCount = res;
      }, (err) => {
        console.log(err);
      }
    );
    this.cartUpdate = this.productService.cartUpdate.subscribe(
      (res: any) => {
        console.log(res);
        this.ctCount = res;
      }, (err) => {
        console.log(err);
      }
    );
  }

  loginModal() {
    this.showLoginModal = true;
  }

  login() {
    this.submitted = true;
    if(!this.email || !this.password) {
      return;
    }
    this.auth.login(this.email, this.password).subscribe(
      (res) => {
        console.log(res);
        this.showLoginModal = false;
        this.email = '';
        this.password = '';
      }, (err) => {
        console.log(err);
      }
    );
  }

  logout() {
    console.log("Clicked logout")
    this.auth.logout();
  }


}
