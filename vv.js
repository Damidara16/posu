import * as React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, ActivityIndicator,Text, TouchableOpacity, Dimensions ,Image, Button, TextInput, StatusBar, ScrollView} from 'react-native';
import { createAppContainer, createSwitchNavigator, withNavigation } from 'react-navigation';
import {createStackNavigator } from 'react-navigation-stack';
import qrImg from './AppFuncs';
import { createDrawerNavigator } from 'react-navigation-drawer';
var HEIGHT= Dimensions.get('window').height;
var WIDTH= Dimensions.get('window').width;
const Realm = require('realm')
import {ModSingle, ModMulti} from './App2';
const { uuid } = require('uuidv4');
import * as Models from './models';
import * as square from './square_api';

const DATAA = [
          {
            id: '1',
            title: 'First Item',
            color:'orange',
            url:'albums'
          },
          {
            id: '2',
            title: 'Second Item',
            color:'purple',
            url:'posts'
          },
          {
            id: '3',
            title: 'Third Item',
            color:'yellow',
            url:'albums'
          },
        ];
const SQUARE_CODE = "Bearer EAAAEHTRrbl0FWvqgytVBqJ0lZV9Q9bavTd1hU75RN0WC380qV8k9r-u27HvnFET";
const SQUARE_VERSION = "2020-01-22"
//          <View style={{flex:1, backgroundColor:''}}></View>
//              <View style={{height:'', width:'', backgroundColor:''}}></View>


const numColumns = 3;
const formatData = (data, numColumns) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
  while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true, id:Math.random()});
    numberOfElementsLastRow++;
  }

  return data;
};





export class Test extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  addToRealm = () => {
    Realm.open({schema:[Models.AppSettings, Models.CartItem]}).then(realm=>{
      realm.write(()=>{
        let d = realm.create('HOSTAPP', {
          store_location: 'HTP5KPH99ZAEH',
          application_id: 'testapp',
          craspa_api_token:'testapptoken',
          tax_id:'QT3BIYTDQINF5LHSAPTBYIAD'
        });
        console.log(d)
      })
      realm.close()
    }).catch(err=>console.log(err))
  }

  componentDidMount(){
    //this.addToRealm()
    //Realm.open({schema:[Models.CartItem, Models.AppSettings, Models.OrderDiscount]}).then(realm=>{
    //  square.createCheckoutCart(realm, SQUARE_CODE, "john").then(res=>console.log(JSON.stringify(res,0,1))).catch(err=>console.log(err));
    //})
  }



  render() {
    return (
      <View style={{flex:1,backgroundColor:'white'}}>

      </View>
    );
  }
}



export class ModList extends React.Component {
  constructor(props){
    super(props);
    this.state = {mods:null, price:this.props.navigation.getParam('price',0), quantity:1};
    this.data = {};
  }
  componentDidMount(){
    let mod = this.props.navigation.getParam('mod_data',false)
    if (mod){
      this.getFetchMods(mod)

    }
  }

  editDataMulti = (mod, id_list, oldPrice, newPrice) => {
    this.data[mod] = id_list
    this.setState({price:(this.state.price-oldPrice)+newPrice})
    console.log(this.getMods())
  }

  editDataSingle = (mod, id, name, remove, oldPrice, newPrice) => {
    remove ? delete this.data[mod] : this.data[mod] = {id:id, price:newPrice, name:name};
    this.setState({price:(this.state.price-oldPrice)+newPrice})

  }

  addToRealm = () => {
    Realm.open({schema:[Models.Customer, Models.CartItem]}).then(realm=>{
      realm.write(()=>{
        let d = realm.create('CartItem', {catalog_object_id:this.props.navigation.getParam('vari_id'),quantity:this.state.quantity.toString(), modifiers:this.getMods()});
        console.log(d)
      })
      realm.close()
      this.props.navigation.navigate('VariListContainer')
    }).catch(err=>console.log(err))
  }

  //square.createCartItemRealm(this.props.navigation.getParam('vari_id'), this.state.price, this.state.quantity, modifiers=this.getMods())

  getMods = () => {
    var out = []
    for (let i of Object.values(this.data)){
      if (typeof(i) === 'object'){
        for (let x of i){
          out.push(x)
        }
      } else {
        out.push(i)

      }
    }
        return out
    }

  getFetchMods = (mods) => {
    fetch("https://connect.squareup.com/v2/catalog/batch-retrieve",
      {
          method:'POST',
          headers:{"Content-Type":"application/json",
              "Authorization":"Bearer EAAAEHTRrbl0FWvqgytVBqJ0lZV9Q9bavTd1hU75RN0WC380qV8k9r-u27HvnFET",
              "Square-Version": "2020-01-22"},
          body:JSON.stringify({
                "object_ids":mods}
          )
      }
    ).then(res=>res.json()).then(res=>{
        var loop = [];
        for (let i of res.objects){
            loop.push(
              i.modifier_list_data.selection_type === 'MULTIPLE' ? <ModMulti key={Math.random()} dataKey={i.id} name={i.modifier_list_data.name} optionData={i.modifier_list_data.modifiers} send={this.editDataMulti}/> : null
            );
        }
        this.setState({mods:loop})
    }
    ).catch(err=>console.log(err))
  }

  render() {
    return (

      <View style={{flex:1}}>

        <View style={{height:'85%', width:'100%'}}>
            <ScrollView>
              <View style={{width:'100%', height:250, backgroundColor:'green', flexDirection:'row'}}>
                  <View style={{flex:1, backgroundColor:'', justifyContent:'center', alignItems:'center'}}>
                      <View style={{height:'80%', width:'80%', backgroundColor:'blue'}}></View>
                  </View>
                  <View style={{flex:2, backgroundColor:'grey'}}>
                      <View style={{height:60, width:'90%', backgroundColor:'red', marginLeft:20, marginTop:20, justifyContent:'center', alignItems:'flex-start', paddingLeft:10, borderRadius:5}}>
                          <Text style={{fontSize:30}}>{this.props.navigation.getParam('name', 'name')}</Text>
                      </View>

                      <View style={{height:60, width:'33%', backgroundColor:'red', marginLeft:20, marginTop:20, justifyContent:'center', alignItems:'flex-start', paddingLeft:10, borderRadius:5}}>
                          <Text style={{fontSize:30}}>${this.state.price*.01}</Text>
                      </View>
                  </View>
              </View>



              <View style={{alignItems:'center'}}>{this.state.mods}</View>
            </ScrollView>
        </View>

          <View style={{position:'absolute',bottom:0,height:'15%', width:'100%', justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
            <TouchableOpacity onPress={()=>this.addToRealm()} style={{backgroundColor:'green', borderRadius:5, width:'80%', height:'80%', justifyContent:'center', alignItems:'center'}}>
            <Text style={{fontSize:30, fontWeight:'700'}}>Add To Cart</Text>
            </TouchableOpacity>
          </View>

      </View>


    );
  }
}
export class VariList extends React.Component {
  _isMounted = false;

  constructor(props){
    super(props);
    this.state = {data:[], color:'green', refresh:true, url:this.props.url, loading:false, empty:false};
    this.data = [];
    this.categories;
  }

  componentDidMount(){
    this._isMounted = true;
    console.log(this.state.url)
  }

  componentWillUnmount(){this._isMounted = false;}

  static getDerivedStateFromProps(nextProps, prevState){
    if (nextProps.url!==prevState.url){
      return {url:nextProps.url, loading:true}
    }
    else return null;
  }

  componentDidUpdate(prevProps, prevState) {
    this.props.navi.navigate('VariListContainer')
    if (prevState.url !== this.state.url) {
      fetch("https://connect.squareup.com/v2/catalog/search", {method:'POST',
      headers: {Authorization: "Bearer EAAAEHTRrbl0FWvqgytVBqJ0lZV9Q9bavTd1hU75RN0WC380qV8k9r-u27HvnFET",
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
            "attribute_value": this.state.url
          }
        }
      })}).then(res=>res.json()).then(res=>{
      let data = []
      for (const i of res.objects){
        for (const x of i.item_data.variations){
          if (i.item_data.modifier_list_info){
               x.modifier_list_info = i.item_data.modifier_list_info
             }
          if(i.item_data.variations.length==1){
               x.item_variation_data.name = i.item_data.name
             }
          if (x.item_variation_data.pricing_type==='FIXED_PRICING'){
            data.push(x)
          }
        }}
        this.setState({data:data, loading:false, empty:false})
      }).catch(error=>this.setState({data:[], loading:false, empty:true}))
    }
  }



  goToATC = (item) => {
    if (item.modifier_list_info){
        this.props.navi.navigate('ModList', {name:item.item_variation_data.name, vari_id:item.id, mod_data:item.modifier_list_info.map(i=>i.modifier_list_id), price:item.item_variation_data.price_money.amount})
      } else {
        this.props.navi.navigate('ModList', {name:item.item_variation_data.name, vari_id:item.id, price:item.item_variation_data.price_money.amount})
      }

  }


  render() {
    var vList = this.state.empty ? <View style={{backgroundColor:'white', width:this.props.WIDTH, height:this.props.HEIGHT, justifyContent:'center', alignItems:'center'}}><Text>No Items</Text></View>
     :  <FlatList
          data={formatData(this.state.data, numColumns)}
          renderItem={({item})=> {
            if (item.empty === true) {
              return <View style={[styles.item, styles.itemInvisible]} />;
          }
            return(
            <View style={styles.item}>
            <TouchableOpacity onPress={()=>this.goToATC(item)} style={{backgroundColor:"white", width:'90%', height:'90%', borderRadius:10, shadowColor: 'grey',
    shadowOffset: {width: -5,height: 5},shadowRadius: 10, shadowOpacity: .5}}>
                <View style={{flex:4, backgroundColor:'', paddingTop:30, paddingLeft:10}}>
                    <Text numberOfLines={2} style={{fontSize:40, fontWeight:'600'}}>{item.item_variation_data.name}</Text>
                </View>
                <View style={{flex:1, backgroundColor:'', paddingLeft:10}}>
                    <Text style={{color:'blue', fontSize:30, fontWeight:'500'}}>${(item.item_variation_data.price_money.amount)*.01}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          }
          keyExtractor={item=>item.id.toString()}
          numColumns={3}
          contentContainerStyle={{backgroundColor:"", width:this.props.WIDTH}}
          />
    return (
      vList
    );
  }
}
export class VariListContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {width:0, height:0}
  }
  componentDidMount(){
    console.log('VariListContainer');
  }
  getLayout = (event) => {
    this.setState({width:event.nativeEvent.layout.width, height:event.nativeEvent.layout.height})
  }
  render() {
    return (
            <View onLayout={(event)=>this.getLayout(event)} style={{flex:4, backgroundColor:'#F5F5F5', justifyContent:'center', alignItems:'center'}}>
              <VariList WIDTH={this.state.width} HEIGHT={this.state.height} url={this.props.screenProps.url} navi={this.props.navigation}/>
            </View>
    );
  }
}



export  default class HostApp extends React.Component {
  constructor(props){
    super(props);
    this.state = {url:'', name:'', width:0, height:0};
    this.categories;

  }


  componentDidMount(){
    square.getFetchCategories(SQUARE_CODE).then(
      res=>{this.categories=res
      this.setState({url:this.categories[0].id})}
    );
  }

  API = (u,n) => {
    this.setState({url: u, name:n})
  }


    getLayout = (event) => {
      this.setState({width:event.nativeEvent.layout.width, height:event.nativeEvent.layout.height})
    }

    render() {
      return (
        <View style={{flex:1,backgroundColor:'white'}}>
            <StatusBar hidden/>
            <View style={{flex:1, flexDirection:'row', backgroundColor:'#FFFFFF'}}>

                <View style={{flex:2, justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
                  <View style={{height:40, width:40, borderRadius:20, justifyContent:'center', alignItems:'center', backgroundColor:'green', marginRight:10, paddingLeft:2}}><Text style={{fontWeight:'bold', fontSize:20, color:'white'}}>C</Text></View>
                  <Text style={{fontWeight:'800', fontSize:20}}>Coffee Shop</Text>
                </View>

                <View style={{flex:7, backgroundColor:'', alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                    <TextInput onChangeText={text=>{this.c(text)}} placeholder='Search for an item...' placeholderTextColor='black' style={{fontSize:20, height: 40, width:'100%',  borderRadius:5, paddingLeft:20, backgroundColor:'#F5F5F5' }}/>
                </View>

                <View style={{flex:1, backgroundColor:'', alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=>{console.log('cart')}}><Text style={{fontSize:30}}>Cart</Text></TouchableOpacity>
                </View>
            <View style={{width:'100%', height:1, backgroundColor:'#F5F5F5', position:'absolute', bottom:0}}></View>
            </View>

            <View style={{flex:8, flexDirection:'row'}}>
            <View style={{flex:2,backgroundColor:'#FFFFFF', paddingTop:20}} onLayout={(event)=>this.getLayout(event)}>
              <FlatList
              bounces={true}
              ItemSeparatorComponent={()=>{return(<View style={{height:20}}></View>)}}
              data={this.categories}
              renderItem={({item})=>
              <TouchableOpacity onPress={()=>{this.API(item.id,item.name)}} style={{backgroundColor: this.state.url === item.id ? 'blue':'green', width:this.state.width*.9, height:100, borderRadius:10, justifyContent:'flex-start', alignItems:'center', flexDirection:'row', paddingLeft:20}}>
                <View style={{width:30, height:30, borderRadius:15, borderWidth:1, borderColor:'white', backgroundColor:'transparent', justifyContent:'center', alignItems:'center', marginRight:20}}></View>
                <Text style={{color:'white', fontSize:20, fontWeight:'400'}}>{item.name}</Text>
              </TouchableOpacity>
                  }
                  contentContainerStyle={{alignItems: 'center'}}
              keyExtractor={item => item.id}
              />
            </View>
              <View style={{flex:6}}><BusinessApp url={this.state.url} name={this.state.name}/></View>
            </View>

        </View>
      );
    }
  }

export  class ListHeaderItem extends React.Component {
    constructor(props){
      super(props);
      this.state = {};
    }

    componentDidMount(){
      console.log('new');
    }



    render() {
      return (
          <View style={{width:'100%', height:50, flexDirection:'row'}}>
            <View style={{flex:1.5, backgroundColor:'', justifyContent:'center', alignItems:'flex-start'}}>
              <Text style={{ marginLeft:20}}>Name</Text>
            </View>
            <View style={{flex:2, backgroundColor:'', justifyContent:'center', alignItems:'center',paddingLeft:0}}>
              <Text>Quantity</Text>
            </View>
            <View style={{flex:1, backgroundColor:'', justifyContent:'center', alignItems:'center',paddingLeft:0}}>
              <Text>Each</Text>
            </View>
            <View style={{flex:1, backgroundColor:'', justifyContent:'center', alignItems:'center',paddingLeft:0}}>
              <Text>Total</Text>
            </View>
          </View>

      );
    }
  }
export  class ListItem extends React.Component {
    constructor(props){
      super(props);
      this.state = {};
    }

    componentDidMount(){
      console.log('new');
    }



    render() {
      return (
          <View style={{width:'100%', height:50, flexDirection:'row'}}>


            <View style={{height:'100%', width:'27.25%', backgroundColor:this.props.color, justifyContent:'center', alignItems:'center'}}>
              <Text>Casta Coffee</Text>
            </View>

            <View style={{height:'100%', width:'36.25%',  backgroundColor:this.props.color, flexDirection:'row', justifyContent:'space-around', alignItems:'center'}}>
              <TouchableOpacity style={{width:25, height:25, borderWidth:1,borderRadius:25/2, backgroundColor:'white', justifyContent:'center', alignItems:'center'}}><Text>-</Text></TouchableOpacity>
              <Text>10</Text>
              <TouchableOpacity style={{width:25, height:25, borderWidth:1,borderRadius:25/2, backgroundColor:'white', justifyContent:'center', alignItems:'center'}}><Text>+</Text></TouchableOpacity>
              <TouchableOpacity style={{width:25, height:25, borderWidth:1,borderRadius:25/2, backgroundColor:'white', justifyContent:'center', alignItems:'center'}}><Text>x</Text></TouchableOpacity>
            </View>

            <View style={{height:'100%', width:'18.25%',  backgroundColor:this.props.color, justifyContent:'center', alignItems:'center'}}>
              <Text>$7.99</Text>
            </View>
            <View style={{height:'100%', width:'18.25%',  backgroundColor:this.props.color, justifyContent:'center', alignItems:'center'}}>
              <Text>$15.98</Text>
            </View>

          </View>

      );
    }
  }
export  class CartCheckout extends React.Component {
    constructor(props){
      super(props);
      this.state = {};
    }


    componentDidMount(){
      console.log('new');
    }



    render() {
      return (
        <View style={{flex:1,backgroundColor:'white', flexDirection:'row'}}>
            <View style={{flex:1,backgroundColor:'green', justifyContent:'center', alignItems:'center'}}>
              <View style={{height:'90%',width:'90%',backgroundColor:'blue'}}>
                <View style={{flex:1,backgroundColor:'yellow', justifyContent:'space-between', alignItems:'center', flexDirection:'row',paddingHorizontal:20}}>
                  <Text style={{fontSize:20, fontWeight:'500'}}>Monday, 15/02/2000</Text>
                  <Text style={{fontSize:20, fontWeight:'500'}}>4:25 PM</Text>
                </View>
                <View style={{flex:8,backgroundColor:'red',  justifyContent:'center', alignItems:'center'}}>

                  <View style={{width:'90%', height:'90%', backgroundColor:'white'}}>
                  <View style={{width:'100%', height:'80%'}}>
                  <ListHeaderItem/>

                  <ScrollView>
                    <ListItem color="#EFF3F2"/>
                    <ListItem/>
                    <ListItem color="#EFF3F2"/>
                    <ListItem/>
                    <ListItem color="#EFF3F2"/>
                    <ListItem/>
                    <ListItem color="#EFF3F2"/>
                    <ListItem/>
                    <ListItem color="#EFF3F2"/>
                    <ListItem/>
                    <ListItem color="#EFF3F2"/>
                    <ListItem/>
                    <ListItem color="#EFF3F2"/>
                    <ListItem/>
                  </ScrollView>
                  </View>
                    <View style={{flexDirection:'row', height:'20%', width:'100%', position:'absolute', bottom:0}}>
                      <View style={{flex:4, backgroundColor:'', justifyContent:'space-around', alignItems:'flex-end', paddingRight:50}}>
                      <Text style={{fontSize:30, fontWeight:'400'}}>Sub Total</Text>
                      <Text style={{fontSize:24, fontWeight:'400'}}>Tax</Text>
                      <Text style={{fontSize:24, fontWeight:'400'}}>Discount</Text>
                      <Text style={{fontSize:30, fontWeight:'600'}}>Total</Text>

                    </View>


                      <View style={{flex:2, backgroundColor:'', justifyContent:'space-around', alignItems:'flex-end', marginRight:20}}>
                        <Text style={{fontSize:30, fontWeight:'400'}}>$63.92</Text>
                        <Text style={{fontSize:24, fontWeight:'400'}}>$18.34</Text>
                        <Text style={{fontSize:24, fontWeight:'400'}}>$0</Text>
                        <Text style={{fontSize:30, fontWeight:'600'}}>$82.26</Text>
                      </View>

                    </View>

                  </View>

                </View>
              </View>
            </View>


            <View style={{flex:1,backgroundColor:'red', justifyContent:'center', alignItems:'center'}}>
              <TouchableOpacity style={{height:200, width:'90%', backgroundColor:'blue', borderRadius:10, justifyContent:'center', alignItems:'center'}}>
                <Text style={{fontSize:40}}>Pay By Swipe, Tap, Dip</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{height:50, width:'40%', backgroundColor:'blue', borderRadius:10, justifyContent:'center', alignItems:'center', position:'absolute', bottom:10, right:10}}>
                <Text style={{fontSize:20}}>Cancel Order</Text>
              </TouchableOpacity>
            </View>

        </View>
      );
    }
  }

export  class StoreLogin extends React.Component {
    constructor(props){
      super(props);
      this.state = {uname:'',password:'', store_code:'', loading:false};
    }

    componentDidMount(){
      Realm.open({schema:[Models.AppSettings]}).then(realm=>{
        const logged = realm.objects('HOSTAPP')[0]
        if (logged){this.props.navigation.navigate('MainScreens')}
        realm.close()
      })

    }


    Validate = () => {
      this.setState({loading:true})
      setTimeout(()=>{this.props.navigation.navigate('MainScreens')}, 0)
    {/*  realm.write(()=>{realm.create('HOSTAPP', {store_location: 'string',
          application_id: 'string',
          craspa_api_token:'string',
          tax_id:'string'})})

        */}

    }



    render() {
      var comp = this.state.loading ? <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><ActivityIndicator size="large" color="#0000ff" /></View> : <View style={{flex:1,backgroundColor:'', justifyContent:'center', alignItems:'center'}}>
        <View style={{flexDirection:'row', height:80, width:400,justifyContent:'center', alignItems:'flex-end', marginBottom:20}}>
        <Text style={{fontSize:70, fontWeight:'700'}}>POS</Text>
        <Text style={{fontSize:20, fontWeight:'700', paddingBottom:12, paddingLeft:10}}>by Craspa</Text>
        </View>
        <TextInput style={{width:400, height:50, borderWidth:2, borderRadius:20, paddingLeft:20, marginBottom:10, fontSize:20}} onChangeText={(text)=>{this.setState({uname:text})}} autoCapitalize='none' autoCorrect={false} placeholder="Username" placeholderTextColor="black"/>
        <TextInput style={{width:400, height:50, borderWidth:2, borderRadius:20, paddingLeft:20, marginBottom:10, fontSize:20}} onChangeText={(text)=>{this.setState({password:text})}} placeholder="Password" textContentType="password" secureTextEntry={true} placeholderTextColor="black"/>
        <TextInput style={{width:400, height:50, borderWidth:2, borderRadius:20, paddingLeft:20, marginBottom:10, fontSize:20}} onChangeText={(text)=>{this.setState({store_code:text})}} placeholder="Store Code" placeholderTextColor="black"/>
        <TouchableOpacity onPress={()=>this.Validate()} style={{width:400, height:50, borderWidth:2, borderRadius:20, backgroundColor:'blue', justifyContent:'center', alignItems:'center'}}><Text style={{fontSize:30}}>Login</Text></TouchableOpacity>
      </View>
      return (
          comp
      );
    }
  }
export  class HomeLogin extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  Validate = () => {
    this.setState({loading:true})
    this.props.navigation.navigate('HostApp')
  {/*  realm.write(()=>{realm.create('HOSTAPP', {store_location: 'string',
        application_id: 'string',
        craspa_api_token:'string',
        tax_id:'string'})})

      */}

  }


  render() {
    return (
      <View style={{flex:1,backgroundColor:'white', justifyContent:'center', alignItems:'center'}}>
        <TouchableOpacity onPress={()=>this.Validate()} style={{width:300, height:100, borderRadius:30, backgroundColor:'grey', justifyContent:'center', alignItems:'center'}}>
          <Text style={{fontSize:30, fontWeight:'700'}}>Start Order</Text>
        </TouchableOpacity>
      </View>
    );
  }
}




const BusinessStack = createStackNavigator({
  VariListContainer:{screen:VariListContainer,
     navigationOptions: ({ navigation }) => ({
     title: '',
     headerShown:false
   })},

  ModList:{screen:ModList},
  CartCheckout:{screen:CartCheckout}
 })

const AppContainer = createAppContainer(BusinessStack);

export class BusinessApp extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    console.log(this.props.url)
  }


  render() {
    return (
      <AppContainer screenProps={{url:this.props.url, navigation:this.props.navigation}}/>
    );
  }
}

const BusinessSwitch = createSwitchNavigator({
  HomeLogin:{screen:HomeLogin},
  HostApp:{screen:HostApp}
})

const AppScreens = createSwitchNavigator({
  StoreLogin:{screen:StoreLogin},
  MainScreens:{screen:BusinessSwitch}
})



const RootContainer =  createAppContainer(AppScreens)



export class Root extends React.Component {
  render() {
    return (
      <RootContainer/>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
  },
  item: {
    justifyContent:'center',
    alignItems:'center',
    flex: 1,
    margin: 1,
    height:275, // approximate a square
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: '#fff',
  },
});
