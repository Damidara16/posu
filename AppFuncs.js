qrImg = (url, size=300, margin=5) => {
  var res = `https://api.qrserver.com/v1/create-qr-code/?data=${url}&size=${size}x${size}&margin=${margin}`;
  return res
}

export default qrImg;

{/*ApiA = () => {
  var data;
  fetch('https://jsonplaceholder.typicode.com/users', {
    method:"GET",
    headers:{
      "Content-Type": "application/json"
    }

  }).then(res=>res.json()).then(res=>{this.data = res})

  <FlatList
  ListHeaderComponent={
    <View style={{height:50,width:'100%', backgroundColor:'#ebebeb', justifyContent:'center',alignItems:'center'}}>
    <Text style={{fontSize:26,fontWeight:'700'}}>Items</Text>
    </View>
  }
  data={APImainItems(caller)}
  renderItem={({item})=>
  <View style={{height:50, width:'80%', justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
  <Text>{item.name}</Text>
  </View>
}
  keyExtractor={item=>item.id}

  />
*/}
