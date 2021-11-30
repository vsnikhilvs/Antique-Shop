import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CartComponent } from './Components/cart/cart.component';
import { CheckoutComponent } from './Components/checkout/checkout.component';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { WishListComponent } from './Components/wish-list/wish-list.component';
import { AuthenticationGuard } from './Guards/authentication.guard';

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },{
    path: "home",
    component: HomeComponent
  },{
    path: "cart",
    component: CartComponent,
    canActivate: [AuthenticationGuard]
  },{
    path: "checkout",
    component: CheckoutComponent,
    canActivate: [AuthenticationGuard]
  },{
    path: "wishlist",
    component: WishListComponent,
    canActivate: [AuthenticationGuard]
  },
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "**", redirectTo: "home" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
