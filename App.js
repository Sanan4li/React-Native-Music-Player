import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
 Button,
 Image
} from 'react-native';
import SongsListScreen from "./Screens/SongsListScreen";
import {request, PERMISSIONS} from 'react-native-permissions';
import SplashScreen from "./Screens/SplashScreen";
class App extends React.Component{
  
  state = {
    storagePermission:null,
  }

  componentDidMount = ()=>{
             // getting permission of storage
             request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(result => {
              this.setState({
                storagePermission : result
              }), ()=>{
                console.log(this.state.storagePermission);
              };
            });

  }
  render(){
   let component = this.state.storagePermission==null?
   <View style={{justifyContent:"center", alignItems:"center", flex:1}}>
     <Text style={{fontSize:25}}>
   Asking for Permissions
 </Text>
   </View>
   :<SongsListScreen/> 
    
   
  return (
    <View style={styles.main}>
     {component}
    
    </View>
  )
}
}

const styles = StyleSheet.create({
  main:{
    flex:1,
    backgroundColor : "#1C2427"
  }
})



export default App;










