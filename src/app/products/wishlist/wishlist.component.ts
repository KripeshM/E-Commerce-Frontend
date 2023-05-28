import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit{
  constructor(private api:ApiService){}
  wishlistproducts:any=[]
  searchTerm:string='';

  ngOnInit(): void {
    this.api.getwishlistitems().subscribe((result)=>{
      console.log(result);
      this.wishlistproducts=result
      
    },
    (result:any)=>{
      console.log(result.error);
      
    }
    )
     
    this.api.searchTerm.subscribe((result:any)=>{
      this.searchTerm=result
      console.log(this.searchTerm);
      
      
  })
  }

  removewishlistitem(id:any){
    this.api.removewishlistitem(id).subscribe((result:any)=>{
      console.log(result);
      alert("Product Removed Successfully")
      this.wishlistproducts=result;
      
    },
    (result:any)=>{
      console.log(result.error);
    }
    )
  }

  addtocart(product:any){
    //add quantity to product
    Object.assign(product,{quantity:1})
    console.log(product);
    this.api.addtocart(product).subscribe((result:any)=>{
      this.api.cartcount()
      this.removewishlistitem(product.id)
      alert(result);
    },
    (result:any)=>{
      alert(result.error)
    }
    )
  }

}


