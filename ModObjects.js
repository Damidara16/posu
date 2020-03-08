import * as React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, TouchableOpacity, Dimensions ,Image, Button, TextInput, StatusBar, ScrollView} from 'react-native';
import { createAppContainer, createSwitchNavigator, withNavigation } from 'react-navigation';
const Realm = require('realm');
const { uuid } = require('uuidv4');
import * as Models from './models';


export class MordMulti extends React.Component {
  constructor(props){
    super(props);
    this.state = {selected:{},price:0}
    this.data = {}
  }

  editSelected(key, value, price){
    this.data[key] ? delete this.data[key] : this.data[key] = value
    var newPrice = this.data[key] === undefined ? this.state.price-price : this.state.price+price
    this.props.send(this.props.dataKey, Object.values(this.data), this.state.price, newPrice)
    this.setState({price:newPrice})
  }


  render() {
    //console.log(this.props.optionData)
    var options = []
    for (let i of this.props.optionData){
      options.push(
        <TouchableOpacity key={Math.random()} onPress={()=>this.editSelected(i.modifier_data.name,i.id, i.modifier_data.price_money.amount)} style={{height:50, width:'100%', borderWidth:1,backgroundColor: this.data[i.modifier_data.name] === i.id ? 'blue':'red'}}>
          <Text>{i.modifier_data.name}</Text>
          <Text>{i.modifier_data.price_money.amount*.01}</Text>
        </TouchableOpacity>
      );
    }
    return (
      <View style={{flexDirection:'',width:'100%', height:this.props.optionData.length*50+30, justifyContent:'', alignItems:'center', backgroundColor:'green', marginTop:0}}>
      <Text style={{fontSize:24}}>{this.props.name}: Select Multiple</Text>
      {options}
      </View>
    );
  }
}

export class ModMulti extends React.Component {
  constructor(props){
    super(props);
    this.state = {selected:{},price:0}
    this.data = {}
  }

  editSelected(key, id, price){
    this.data[key] ? delete this.data[key] : this.data[key] = {id:id, price:price, name:key}
    //console.log(this.data[key])
    var newPrice = this.data[key] === undefined ? this.state.price-price : this.state.price+price
    this.props.send(this.props.dataKey, Object.values(this.data), this.state.price, newPrice)
    this.setState({price:newPrice})
  }

  render() {
    //console.log(this.props.optionData)
    var options = []
    for (let i of this.props.optionData){
      options.push(
        <TouchableOpacity key={Math.random()} onPress={()=>this.editSelected(i.option_name,i.option_id, i.option_price)} style={{justifyContent:'space-between',alignItems:'center', paddingHorizontal:30,flexDirection:'row',height:50, width:'100%' ,
        backgroundColor:  this.data[i.option_name] ? 'rgba(41, 224, 117, 0.8)' : '#FFFFFF'}}>
          <Text style={{fontSize:20, fontWeight:'600'}}>{i.option_name}</Text>
          <Text style={{fontSize:20, fontWeight:'600'}}>+ ${i.option_price*.01}</Text>
        </TouchableOpacity>
      );
    }
    return (
      <View style={{flexDirection:'',width:'95%', height:this.props.optionData.length*50+50, justifyContent:'', alignItems:'center',  marginTop:10, backgroundColor:''}}>
      <View style={{marginBottom:0, width:'100%', height:50, justifyContent:'space-between', alignItems:'center', flexDirection:'row', paddingHorizontal:20, backgroundColor:'', paddingTop:6}}>
      <Text style={{fontSize:30, marginBottom:10}}>{this.props.name}</Text>
      <Text style={{fontSize:16, marginBottom:10}}>Mulit Select</Text>
      </View>
      {options}
      </View>
    );
  }
}

{/*
  <TouchableOpacity key={Math.random()} onPress={()=>this.onSelect(i.option_id, i.option_name, i.option_price)} style={{justifyContent:'space-between',alignItems:'center', paddingHorizontal:30,flexDirection:'row',height:50, width:'100%' ,backgroundColor: this.data[i.option_name] === i.option_name ? 'rgba(41, 224, 117, 0.8)':'#FFFFFF'}}>
    <Text style={{fontSize:20, fontWeight:'600'}}>{i.option_name}</Text>
    <Text style={{fontSize:20, fontWeight:'600'}}>+ ${i.option_price*.01}</Text>
  </TouchableOpacity>
  */}

export class ModSingle extends React.Component {
          constructor(props){
            super(props);
            this.state = {selected:null,price:0}
          }

          onSelect = (id, name, price) => {
            var selected_id = this.state.selected === id ? null:id
            var remove = selected_id === null ? true:false
            var newPrice = remove ? 0:price
            this.props.send(this.props.dataKey, selected_id, name, remove, this.state.price, newPrice)
            this.setState({selected:this.state.selected === id ? null:id, price:newPrice})
          }

          render() {
           var options = [];
            for (let i of this.props.optionData){
              options.push(
                <TouchableOpacity key={Math.random()} onPress={()=>this.onSelect(i.option_id, i.option_name, i.option_price)} style={{justifyContent:'space-between',alignItems:'center', paddingHorizontal:30,flexDirection:'row',height:50, width:'100%' ,backgroundColor: this.state.selected === i.option_id ? 'rgba(41, 224, 117, 0.8)':'#FFFFFF'}}>
                  <Text style={{fontSize:20, fontWeight:'600'}}>{i.option_name}</Text>
                  <Text style={{fontSize:20, fontWeight:'600'}}>+ ${i.option_price*.01}</Text>
                </TouchableOpacity>
              );
            }
            return (
              <View key={Math.random()} style={{flexDirection:'',width:'95%', height:this.props.optionData.length*50+50, justifyContent:'', alignItems:'center',  marginTop:10, backgroundColor:''}}>
              <View key={Math.random()} style={{marginBottom:0, width:'100%', height:50, justifyContent:'space-between', alignItems:'center', flexDirection:'row', paddingHorizontal:20, backgroundColor:'', paddingTop:6}}>
              <Text key={Math.random()} style={{fontSize:30, marginBottom:10}}>{this.props.name}</Text>
              <Text key={Math.random()} style={{fontSize:16, marginBottom:10}}>Single Select</Text>
              </View>
              {options}
              </View>
            );
          }
        }



//called after "complete payment"
const checkoutfetch = (body, payment_method) => {

  if (payment_method==='via_onfile'){
    //ask for which cart
  } else if (payemnt_method==='via_link'){
    //return qr
  } else {
    //square payment device
  }

}
//fetch('', {header:{Authorization:,"Content-Type": "application/json"}})

const checkoutCart = (name) => {
  Realm.open({schema:[Models.CartItem, Models.AppSettings, Models.OrderDiscount]}).then(realm=>{
    let app = realm.objects('HOSTAPP')[0];
    source = `order from ${app.application_id}`;// created by ${Realm.objects('Customer')[0].customer_id}`;

    let body = {
      line_items:realm.objects('CartItem').map(i=>i.toformat),
      source:{name:source},
      taxes:[{catalog_object_id:app.tax_id}],
      fulfillments: [
        {
          "type": "PICKUP",
          "state": "PROPOSED",
          "pickup_details": {
            "recipient": {
              "display_name": name
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
    console.log(JSON.stringify(body))
    //checkoutfetch(body, onfile)
  }
  ).catch(err=>console.log(err))
}


const getCart = () => {
  Realm.open({schema:[Models.CartItem]}).then(realm=>{
    console.log(realm.objects('CartItem'))
    realm.close()
  })
}
