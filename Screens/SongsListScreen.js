import React, { Component } from 'react'
import {View, Text , StyleSheet, Dimensions, Image , TouchableOpacity, FlatList} from "react-native";
import TrackPlayer from 'react-native-track-player';
import MusicFiles from 'react-native-get-music-files';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";
import ProgressBarAnimated from 'react-native-progress-bar-animated';
 class SongsListScreen extends Component {
     state = {
         songs : null,
         songsAdded: [],
         currentSong : {
            id : 1,
            url : "",
            title : "No Song To Play",
            artist : "No Artist",
            album : "No Album",
            genre : "No Genre"
         },
         progress: 10,
         progressWithOnComplete: 0,
         progressCustomized: 0,
         playingIcon : "play",
         songPlayed : "no",

     }
     increase = (key, value) => {
        this.setState({
          [key]: this.state[key] + value,
        });
      }
     
      
       playSong = (song)=>{
        let newSongToPlay = {
            id : song.id,
            url : "file://"+song.path,
            title : song.title,
            artist : song.author,
            album : song.album,
            genre : song.genre
        }
        this.setState({
            currentSong : newSongToPlay,
            playingIcon : "pause",
            songPlayed : "yes"
        }, ()=>{
            TrackPlayer.add([this.state.currentSong]).then(function() {
                console.log("Track Added");
                TrackPlayer.play();
            });
        });
       }
     componentDidMount = ()=>{
        let Songs; 
        // loading all the music files presesnt in my phone
        MusicFiles.getAll({
            id : true,
          blured : true, 
          artist : true,
          duration : true, 
          cover : true, 
          genre : true,
          title : true,
          cover : true,
             }).then((tracks) => {
                Songs = tracks;
                console.log(Songs);
                this.setState({
                 songs : Songs
               });
               TrackPlayer.setupPlayer().then(() => {
                console.log("Player Setup Completed");
               
            });
             }).catch(error => {
             console.log(error)
        });

       
     }

     loadSongs = ()=>{
        if(this.state.songs== null){
          return(
           <View style={{alignItems:"center"}}>
                <Text style={{color:"white"}}>Loading Songs... Please Wait....</Text>
           </View>
          )
        }
        else{
        return (
            <FlatList data={this.state.songs} renderItem={(song)=>{
                let minutes =  Math.floor(song.item.duration / 60000);;
                    let seconds = ((song.item.duration % 60000) / 1000).toFixed(0);
                      return(
                        
                        <TouchableOpacity onPress={
                            ()=>{
                                this.playSong(song.item);
                            }
                        }>

                       
                        <View style={styles.songInfo}>
                     <View>
                     <Text style={{color:"#b3b3b3", overflow:"hidden"}} numberOfLines={1}>{song.item.title}</Text>
                     </View>
                      <View style={{flexDirection:"row", justifyContent:"space-between", marginTop:10}}>
                      <Text style={{color:"#737373"}}>{song.item.album}</Text>
                    <View style={{}}>                    
                        <Text style={{color:"#b3b3b3", fontSize:16 , }}>{minutes+":"+seconds}</Text>
                    </View>
                      </View>
                      </View>
                      </TouchableOpacity>
                      );
            }} />
        )
        }
       
         
     }

    render() {
        const barWidth = Dimensions.get('screen').width - 50;
        const progressCustomStyles = {
          backgroundColor: 'red', 
          borderRadius: 0,
          borderColor: 'orange',
        };
        return (
           <View style={styles.main}>
             <View style={{height:"75%"}}>
             {this.loadSongs()}
             </View>
             <View style={{height:"13%",  flexDirection:"row", borderTopColor:"#737373", borderTopWidth:0.6}}>
                <View style={{width:"20%",height:"80%", backgroundColor:"white", marginLeft:"5%",marginTop:15}}>
                    
                </View>
                <View style={{flexDirection:"column",justifyContent:"space-between",padding:10, marginLeft:"5%",marginTop:5, width:"75%"}}>
                    <Text style={{color:"#b3b3b3", overflow:"hidden",fontSize:18, fontFamily:"baskerv", width:"70%"}} numberOfLines={1}>{this.state.currentSong.title}</Text>
                    <Text style={{color:"#737373"}}>{this.state.currentSong.album}</Text>
                    <Text style={{color:"#737373", }}>Duration</Text>
                   
                </View>
                
             </View>
             <View style={{height:"3%", marginTop:0,  justifyContent:"center",alignItems:"center"}}>
           
             </View>
                
             <View style={{backgroundColor:"#1affb2", height:"9%", marginTop:0, justifyContent:"center", alignContent:"center"}}>
               <View style={{ flexDirection:"row", justifyContent:"space-around"}}>
               <FontAwesome5 name="retweet" color="white" size={25} />
               <FontAwesome name="step-backward" color="white" size={25} />
                <TouchableOpacity onPress={
                    ()=>{
                        if(this.state.songPlayed=="yes"){
                            TrackPlayer.pause();
                            this.setState({
                                songPlayed : "no",
                                playingIcon : "play",
                            });
                        }
                        else{
                         TrackPlayer.play();
                         this.setState({
                             songPlayed : "yes",
                             playingIcon : "pause",
                         });
                        } 
                    }
                }
                >
                    <FontAwesome name={this.state.playingIcon} color="white" size={25}/>
                </TouchableOpacity>
                <FontAwesome name="step-forward" color="white" size={25}/>
                <Feather name="shuffle" size={25} color="white"/>
               </View>
                
             </View> 
           </View>
        )
    }
}
const styles = StyleSheet.create({
    main:{
       flex:1,
       margin:0,
       padding:5
    },
    songInfo : {
        marginTop:1, 
        borderBottomColor:"#737373", 
        paddingTop:3 , 
        borderBottomWidth:0.6,
        justifyContent:"space-between",
        padding : 20,
        margin:10
        },

})
export default SongsListScreen;