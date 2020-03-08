import * as React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, TouchableOpacity, Dimensions ,Image, Button, TextInput, StatusBar, ScrollView} from 'react-native';
import { createAppContainer, createSwitchNavigator, withNavigation } from 'react-navigation';
import {createStackNavigator } from 'react-navigation-stack';
import qrImg from './AppFuncs';
import { createDrawerNavigator } from 'react-navigation-drawer';

export class ModMulti extends React.Component {
  constructor(props){
    super(props);
    this.state = {selected:{}}
    this.data = {}

  }

  editSelected(key){
    this.data[key] ? delete this.data[key] : this.data[key] = true
    this.setState({})
    this.props.send(this.props.modi, Object.values(this.data))
  }

  render() {
      var myloop = [];

    for (let i = 1; i < 4; i++) {
      myloop.push(
        <TouchableOpacity onPress={()=>this.editSelected(i)} style={{height:50, width:50, backgroundColor:this.data[i] ? 'blue':'red'}}>
        </TouchableOpacity>
      );
    }

    return (
      <View style={{flexDirection:'row',width:'100%', height:100, justifyContent:'space-around', alignItems:'center', backgroundColor:'blue', marginTop:10}}>
      {myloop}
      </View>
    );
  }
}
export class ModMeulti extends React.Component {
  constructor(props){
    super(props);
    this.state = {selected:{}}
    this.data = {}

  }

  editSelected(key){
    this.data[key] ? delete this.data[key] : this.data[key] = true
    this.setState({})
    this.props.send(this.props.modi, Object.values(this.data))
  }

  render() {
      var myloop = [];

    for (let i = 1; i < 4; i++) {
      myloop.push(
        <TouchableOpacity onPress={()=>this.editSelected(i)} style={{height:50, width:50, backgroundColor:this.data[i] ? 'blue':'red'}}>
        </TouchableOpacity>
      );
    }

    return (
      <View style={{flexDirection:'row',width:'100%', height:100, justifyContent:'space-around', alignItems:'center', backgroundColor:'green', marginTop:10}}>
      {myloop}
      </View>
    );
  }
}
export class ModSingle extends React.Component {
  constructor(props){
    super(props);
    this.state = {selected:null}
  }

  onSelect = (id) => {
    this.setState({selected:this.state.selected === id ? null:id})
    var n = this.state.selected === id ? null:id
    var remove = n === null ? true:false
    this.props.send(this.props.modi,n, remove)
  }

  render() {
      var myloop = [];

    for (let i = 1; i < 4; i++) {
      myloop.push(
        <TouchableOpacity onPress={()=>this.onSelect(i)} style={{height:50, width:50, backgroundColor: this.state.selected == i ? 'blue':'red'}}>
        </TouchableOpacity>
      );
    }

    return (
      <View style={{flexDirection:'row',width:'100%', height:100, justifyContent:'space-around', alignItems:'center', backgroundColor:'green', marginTop:10}}>
      {myloop}
      </View>
    );
  }
}


export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {s:{}}
    this.data = {}
  }
  editDataSingle = (mod, id, remove) => {
    remove ? delete this.data[mod]:this.data[mod] = id
  }

  editDataMulti = (mod, id_list) => {
    this.data[mod] = id_list
    //replace ? delete this.data[mod]:this.data[mod] = id
  }

  toStr = (data) =>{
    var p = ''
    for (let i in Object.values(data)){
      p= p+' '+String(i)
    }
    return p
  }
  render() {
    var myloop = [];
    for (let i in this.data) {
      myloop.push(
        typeof(this.data[i]) === 'object' ? <Text>{i} is also {this.toStr(this.data[i])}</Text> : <Text>{i} is {this.data[i]}</Text>
      );
    }
    return (
      <View style={styles.container}>
      </View>
    );
  }
}
