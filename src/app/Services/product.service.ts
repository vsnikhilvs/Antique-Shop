import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Product } from './product';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    baseUrl = environment.baseUrl;

    private wishlist = new BehaviorSubject(null);
    wishlistUpdate = this.wishlist.asObservable();

    private cart = new BehaviorSubject(null);
    cartUpdate = this.cart.asObservable();

    constructor(private http: HttpClient) { }

    updateWishList(data: any) {
        this.wishlist.next(data);
    }

    updateCart(data: any) {
        this.cart.next(data);
    }

    getProductsSmall() {
        return this.http.get<any>('assets/products-small.json')
            .toPromise()
            .then(res => <Product[]>res.data)
            .then(data => { return data; });
    }

    getWishlist() {
        return this.http.get<any>(`${this.baseUrl}/accounts/wishlist`) ;  
    }

    updatewl(item: any) {
        return this.http.put<any>(`${this.baseUrl}/accounts/wishlist`, {
            item
        });
    }

    getCartlist() {
        return this.http.get<any>(`${this.baseUrl}/accounts/cart`) ;  
    }

    updatect(item: any) {
        return this.http.put<any>(`${this.baseUrl}/accounts/cart`, {
            item
        });
    }

    searchQuery(query: string) {
        return this.http.get<any>(`${this.baseUrl}/products/search/${query}`);
    }
}
