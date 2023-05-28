import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{
  constructor(private api:ApiService,private checkout:FormBuilder){}
  cartItems:any=[];
  searchTerm:string='';
  totalprice:any;
  paymentstatus:boolean=false;
  offerstatus:boolean=false;
  discountstatus:boolean=true;

  username:string=''
  housenumber:string='';
  streetname:string=''
  pincode:string=''
  state:string=''

  public payPalConfig?: IPayPalConfig;
  showSuccess:boolean=false;
  showpaypal:boolean=false;

  ngOnInit(): void {
    this.initConfig();
    this.api.getcartitems().subscribe((result:any)=>{
      console.log(result);
      this.cartItems=result;
      //call getcarttotal
      this.getcarttotal()
      
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

  removecartitem(id:any){
    this.api.removecartitem(id).subscribe((result:any)=>{
      console.log(result);
      // alert("Product Removed Successfully")
      this.cartItems=result;
      this.getcarttotal()
      this.api.cartcount()
      
      
    },
    (result:any)=>{

    }
    )
  }

  getcarttotal(){
    let total=0;
    this.cartItems.forEach((item:any)=>{
      total+=item.grandtotal
      this.totalprice=Math.ceil(total)
    })
  }

  incrementcount(id:any){
    this.api.incrementcount(id).subscribe((result:any)=>{
      console.log(result);
      this.cartItems=result;
      this.getcarttotal()
      
    },
    (result:any)=>{
      alert(result.error);
      
    })
  }

  decrementcount(id:any){
    this.api.decrementcount(id).subscribe((result:any)=>{
      this.cartItems=result
      this.getcarttotal()
    },
    (result:any)=>{
      alert(result.error);
      
    }
    )
  }

  checkoutForm=this.checkout.group({
    username:['',[Validators.required,Validators.pattern('[a-zA-Z]*')]],
    housenumber:['',[Validators.required,Validators.pattern('[0-9]*')]],
    streetname:['',[Validators.required,Validators.pattern('[a-zA-Z]*')]],
    pincode:['',[Validators.required,Validators.pattern('[0-9]*')]],
    state:['',[Validators.required,Validators.pattern('[a-zA-Z]*')]]
  })


  submitform(){
    if(this.checkoutForm.valid){
      this.paymentstatus=true;
      console.log(this.checkoutForm);
      this.username=this.checkoutForm.value.username||''
      this.housenumber=this.checkoutForm.value.housenumber||''
      this.streetname=this.checkoutForm.value.streetname||''
      this.pincode=this.checkoutForm.value.pincode||''
      this.state=this.checkoutForm.value.state||''
      
    }
    else{
      alert("Please provide valid details")
    }
  }

  offers(){
    
    this.offerstatus=true;
    this.discountstatus=false;
  }

  discounts(value:any){
    this.totalprice=Math.ceil(this.totalprice*(100-value)/100)
    this.discountstatus=true;
  }
  

  makepayment(){
    this.showpaypal=true;
  }

  modalclose(){
    this.checkoutForm.reset()
    this.paymentstatus=false;
    this.showpaypal=false;
    this.getcarttotal()
  }

  //paypal 
  private initConfig(): void {
    this.payPalConfig = {
    currency: 'EUR',
    clientId: 'sb',
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: '9.99',
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: '9.99'
              }
            }
          },
          items: [
            {
              name: 'Enterprise Subscription',
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'EUR',
                value: '9.99',
              },
            }
          ]
        }
      ]
    },
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'vertical'
    },
    onApprove: (data, actions) => {
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then((details:any) => {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      this.showSuccess = true;
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
    },
    onError: err => {
      console.log('OnError', err);
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    },
  };
  }
  
}
