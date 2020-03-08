const { uuid } = require('uuidv4');

const AppSettings = {
  name:'HOSTAPP',
  properties:{
    store_location: 'string',
    application_id: 'string',
    //device_info:'Device?',
    craspa_api_token:'string?',
    tax_id:'string'
  }
}



const Customer = {
  name:'Customer',
  properties:{
    customer_id:'string'
  }
}

const Modifier = {
  name:'Modifier',
  properties:{
    name:'string',
    id:'string',
    price:'int'
  }
}

class CartItem{
  get toFormat() {
    let res = {
      catalog_object_id:this.catalog_object_id,
      quantity:this.quantity
    }
    if (this.modifiers.length !== 0){
      res.modifiers = Object.keys(this.modifiers).map(i=>{return {catalog_object_id:this.modifiers[i]}})
    }
    if (this.applied_discounts.length !== 0){
      res.applied_discounts = Object.keys(this.applied_discounts).map(i=>{return {catalog_object_id:this.applied_discounts[i]}})
    }
    return res
  }

  get toCartFormat(){
    let res = {

    }
  }
}


CartItem.schema = {
  name:'CartItem',
  primaryKey:'uuid',
  properties:{
    uuid:'string',
    name:'string',
    catalog_object_id:'string',
    applied_discounts:'string?[]',
    quantity:'string',
    modifiers:'Modifier[]',
    total:'int',
  }
}



class Discount {
  get toformat(){
    return {catalog_object_id:this.catalog_object_id}
  }
}
const OrderDiscount = {
  name:'discount',
  properties:{
    catalog_object_id:'string'
  }
}

export { CartItem, OrderDiscount, Customer, AppSettings, Modifier};
