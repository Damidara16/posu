const Realm = require('realm')
//const SQUARE_AUTH = "Bearer EAAAEHTRrbl0FWvqgytVBqJ0lZV9Q9bavTd1hU75RN0WC380qV8k9r-u27HvnFET";
const SQUARE_VERSION = "2020-01-22"
const { uuid } = require('uuidv4');
import * as Model from './models';


export const getFetchCategories = async (SQUARE_AUTH) => {
  const fetchCall = await fetch("https://connect.squareup.com/v2/catalog/list?types=category", {
      method:'GET',
      headers: {
        Authorization: SQUARE_AUTH,
        "Content-Type": "application/json",
        "Square-Version": SQUARE_VERSION
      }
    })
  const fetchJson = await fetchCall.json()
  let response = []
  for (let i of fetchJson.objects){
    response.push(
      {
        name:i.category_data.name,
        id:i.id,
        square_data:{
          "is_deleted": i.is_deleted,
          "present_at_all_locations": i.present_at_all_locations,
          "type": i.type,
          "updated_at": i.updated_at,
          "version":i.version
        },
        metadata:{}
      }
    )
  }

  return response;

  {/*
    name:
    id:
    */}

}

export const getFetchCategoryItemVariations = async (category_id, SQUARE_AUTH) => {
    const fetchCall = await fetch("https://connect.squareup.com/v2/catalog/search",
                {method:'POST',
                  headers: {Authorization: SQUARE_AUTH,
                    "Content-Type": "application/json",
                    "Square-Version": SQUARE_VERSION},
                  body:JSON.stringify({
                    "object_types": [
                      "ITEM"
                    ],
                    "include_deleted_objects": false,
                    "include_related_objects": false,
                    "query": {
                      "exact_query": {
                        "attribute_name": "category_id",
                        "attribute_value": category_id
                      }
                    }
                  })})
    const fetchJson = await fetchCall.json()
    if (Object.keys(fetchJson).length === 1 && fetchJson.latest_time){
      return []
    }

    let response = []
    for (const i of fetchJson.objects){
      for (const x of i.item_data.variations){
          if (x.item_variation_data.pricing_type==='FIXED_PRICING'){
            dataPart = {
                   "id":x.id,
                   "parent_item_id": i.id,
                   "name": x.item_variation_data.name,
                   "sku": x.item_variation_data.sku,
                   "price": x.item_variation_data.price_money.amount,
                   "currency": x.item_variation_data.price_money.currency,
                   square_data:{
                     "updated_at":x.updated_at,
                     "type":x.type,
                     "version": x.version,
                     "is_deleted": x.is_deleted,
                     "present_at_all_locations": x.present_at_all_locations,
                    },
                    metadata:{},
              }

              if (i.item_data.modifier_list_info){
                //dataPart.mod_ids = i.item_data.modifier_list_info.map(i=>{return({id:i.modifier_list_id})})
                dataPart.mod_ids = i.item_data.modifier_list_info.map(i=>i.modifier_list_id)
              }

              if(i.item_data.variations.length==1){
                dataPart.name = i.item_data.name
              }

              response.push(dataPart)
      }
    }
  }

    return response;

    //return JSON.stringify(fetchJson.objects);

    {/*
      name:
      org_item_id:
      mod_list_ids:

      */}
  }

export const getFetchModsWithOptions = async (mod_ids, SQUARE_AUTH) => {
  const fetchCall = await fetch("https://connect.squareup.com/v2/catalog/batch-retrieve",
    {
        method:'POST',
        headers:{"Content-Type":"application/json",
            "Authorization":SQUARE_AUTH,
            "Square-Version": SQUARE_VERSION},
        body:JSON.stringify({
              "object_ids":mod_ids}
        )
    }
  )
  const fetchJson = await fetchCall.json();
  if (Object.keys(fetchJson).length === 1 && fetchJson.latest_time){
    return []
  }
  //console.log(JSON.stringify(fetchJson.objects, 0, 1))
  let response = []
  for (const i of fetchJson.objects){
    if (i.type === "MODIFIER_LIST"){
      dataPart = {
        name:i.modifier_list_data.name,
        id:i.id,
        selection_type:i.modifier_list_data.selection_type,
        options:[],
        square_data:{
          "updated_at": i.updated_at,
          "version": i.version,
          "is_deleted": i.is_deleted,
          "present_at_all_locations": i.present_at_all_locations,
        }
      }
      for (let x of i.modifier_list_data.modifiers){
        dataPart.options.push({
          option_id:x.id,
          option_name:x.modifier_data.name,
          option_price:x.modifier_data.price_money.amount,
          option_currency:x.modifier_data.price_money.currency,
          pre_selected:x.modifier_data.on_by_default,
        })
      }
      response.push(dataPart)
    }
  }
  return response
  {/*

    name:
    id:
    selection_type:
    options:{
      option_id:
      option_name:
      option_price:
      option_currency:
      on_by_default:
        square_data:{
        "updated_at": "2020-02-09T20:13:39.456Z",
        "version": 1581279219456,
        "is_deleted": false,
        "present_at_all_locations": true,
    }
    }



    */}
}




export const oo = async (realm) => {
  let c = realm.objects('CartItem');
  console.log(c)
  realm.close()

}
export const createCheckoutCart = async(realm, SQUARE_AUTH, customer_name='') => {
  const app = realm.objects('HOSTAPP')[0];
  const source = `order from ${app.application_id}`;// created by ${Realm.objects('Customer')[0].customer_id}`;
  let body = {
      line_items:realm.objects('CartItem').map(i=>i.toFormat),
      source:{name:source},
      taxes:[{catalog_object_id:app.tax_id}],
      fulfillments: [
        {
          "type": "PICKUP",
          "state": "PROPOSED",
          "pickup_details": {
            "recipient": {
              "display_name": customer_name
            },
            "auto_complete_duration": "P1D",
            "schedule_type": "ASAP",
            "pickup_at":new Date
          }
        }
      ],
      idempotency_key:uuid()
    }

    realm.objects('discount').length > 0 ? body.discounts = realm.objects('discount').map(i=>i.toformat) : null
    //console.log(JSON.stringify(body))
    realm.close()
    return body

}



export const getSquarePaySource = async (SQUARE_AUTH)=>{}

export const removeCartItemRealm = async (uuid) => {
  const realm = await Realm.open({schema:[Model.Customer, Model.CartItem, Model.Modifier]})
  let items = realm.objects('CartItem');
  let item = items.filtered(`uuid = ${uuid}`)
  realm.write(()=>{
    realm.delete(item);
  })
  realm.close()
  return true
}

export const createCartItemRealm = async (name,catalog_object_id, total, quantity=1,modifiers=[],applied_discounts=[]) => {
  const realm = await Realm.open({schema:[Model.Customer, Model.CartItem, Model.Modifier]})
  realm.write(()=>{
    realm.create('CartItem' ,{
        uuid:uuid(),
        name:name,
        catalog_object_id:catalog_object_id,
        quantity:quantity.toString(),
        modifiers:modifiers,
        total:total})
  }
)
  //console.log(realm.objects('CartItem'))

  realm.close()
  return true
}


export const getCheckoutCartRealm = async () => {
  const realm = await Realm.open({schema:[Model.CartItem, Model.AppSettings, Model.OrderDiscount, Model.Modifier]})
  return realm.objects('CartItem')
}

export const postSquarePayOrder = async () =>{}
