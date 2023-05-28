import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //to hold search value
  searchTerm=new BehaviorSubject('') 

  //to hold cart count
  cartitemcount=new BehaviorSubject(0);

  constructor(private http:HttpClient) {
    this.cartcount()
   }

  baseUrl='https://e-commerce-aful.onrender.com';
  //api call for get all products
  getallproducts(){
    return this.http.get(`${this.baseUrl}/products/all-products`)
  }

  viewProduct(id:any){
    return this.http.get(`${this.baseUrl}/products/view-product/${id}`)
  }

  //api call for add to wishlist
  addtowishlist(id:any,title:any,price:any,image:any){
    const body={
      id,
      title,
      price,
      image
    }
    return this.http.post(`${this.baseUrl}/wishlist/add-to-wishlist`,body)
  }

  //api call for get wishlist items
  getwishlistitems(){
    return this.http.get(`${this.baseUrl}/wishlist/get-wishlist`)
  }

  removewishlistitem(id:any){
    return this.http.delete(`${this.baseUrl}/wishlist/remove-wishlist-item/${id}`)
  }

  addtocart(product:any){
    const body={
      id:product.id,
      title:product.title,
      price:product.price,
      image:product.image,
      quantity:product.quantity
    }
    return this.http.post(`${this.baseUrl}/cart/add-to-cart`,body)
  }

  //get cart data
  getcartitems(){
    return this.http.get(`${this.baseUrl}/cart/get-cart`)
  }

  cartcount(){
    this.getcartitems().subscribe((result:any)=>{ //array of cart items
      this.cartitemcount.next(result.length)
    })
  }

  removecartitem(id:any){
    return this.http.delete(`${this.baseUrl}/cart/remove-cart-item/${id}`)
  }

  incrementcount(id:any){
    return this.http.get(`${this.baseUrl}/cart/increment-count/${id}`)
  }

  decrementcount(id:any){
    return this.http.get(`${this.baseUrl}/cart/decrement-count/${id}`)
  }
}
