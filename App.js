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
class App extends React.Component{
  


  render(){
  return (
    <View style={styles.main}>
     
     <SongsListScreen/>
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










