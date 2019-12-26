import React, {Component} from "react";
import {View, Text, StyleSheet, Image} from "react-native";
import SongsListScreen from "./SongsListScreen";
class SplashScreen extends Component {
    state = {
        timePassed: false,
    };
    componentDidMount() {
        setTimeout( () => {
            this.setTimePassed();
        },3000);
    }
    setTimePassed() {
        this.setState({timePassed: true});
    }
    render(){
     
        
        return <View style={styles.main}>
                 <Image source={require("./StartScreenIcon.jpg")} style={{ width: "90%", height: "50%"}} resizeMode="contain"  />
                <Text style={{color:"white", fontSize:30}}>
                    Music Player
                </Text>
                <Text style={{color:"aqua", fontSize:16}}>
                    Loading Songs... Please Wait...
                </Text>
             </View> ;
       
       
      
    }
}

const styles = StyleSheet.create({
    main:{
        flex:1,
        backgroundColor:"black",
       justifyContent:"center",
        alignItems:"center",
    }
});

export default SplashScreen;

















