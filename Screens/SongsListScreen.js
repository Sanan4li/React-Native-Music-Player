import React, { Component } from 'react'
import {View, Text , StyleSheet, Modal, Image ,Alert, TouchableWithoutFeedback ,TouchableHighlight, FlatList} from "react-native";
import TrackPlayer from 'react-native-track-player';
import MusicFiles from 'react-native-get-music-files';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";
import * as Progress from 'react-native-progress';
import SplashScreen from "./SplashScreen";
 class SongsListScreen extends Component {
     state = {
         songs : null,
         songsAdded: [],
         modalVisible: false,
         repeat : false,
         repeatIconColor:"white",
         currentSong : {  
            id : 1,
            url : "",
            title : "No Song To Play",
            artist : "No Artist",
            album : "No Album",
            genre : "No Genre"
         },
        
         playingIcon : "play",
         songPlayed : "no",

     }
     
   
      
       playSong = (song)=>{
        this.setState({
           
            playingIcon : "pause",
            songPlayed : "yes",
            currentSong : song,

        }, ()=>{
            TrackPlayer.play();
            TrackPlayer.skip(song.id);
            
        });
       }

       addTracks = ()=>{
        TrackPlayer.updateOptions({
           
            stopWithApp: false,
        
               capabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
                TrackPlayer.CAPABILITY_STOP,
            ],
            
            // An array of capabilities that will show up when the notification is in the compact form on Android
            compactCapabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
                TrackPlayer.CAPABILITY_STOP,
            ],
            notificationCapabilities : [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
                TrackPlayer.CAPABILITY_STOP,
            ],
            
        
            
        });
           TrackPlayer.add(this.state.songs).then(
            ()=>{
                console.log("Tracks Added");
               this.setState({
                   currentSong : this.state.songs[0]
               });
            }
           );
       }

       setModalVisible = (visible)=> {
        this.setState({modalVisible: visible});
      }


     componentDidMount = ()=>{
  
       
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
                 console.log(tracks);
                let newSongs = tracks.map(
                    (track)=>{
                        return {
                            id : track.id,
                            url : "file://"+track.path,
                            title : track.fileName,
                            artist : track.author,
                            album : track.album,
                            genre : track.genre,
                            duration : track.duration,
                            artwork : track.cover
                        }
                    }
                );
                this.setState({
                    songs : newSongs
                });


               TrackPlayer.setupPlayer().then(() => {
                console.log("Player Setup Completed");
               
               this.addTracks();
            });
             }).catch(error => {
             console.log(error)
        });
       
        // if the track changed
        this.onTrackChange = TrackPlayer.addEventListener('playback-track-changed', async (data) => {
            
            
                const track = await TrackPlayer.getTrack(data.nextTrack);
                this.setState({
                    currentSong : track,
                });
                
            
        });  
     }

     loadSongs = ()=>{
        if(this.state.songs== null){
          return(
          <SplashScreen/>
          )
        }
        else{
        return (
            <FlatList data={this.state.songs} renderItem={(song)=>{
                let album = song.item.album;
                if(album==null){
                    album = "No Album ";
                }
                let minutes =  Math.floor(song.item.duration / 60000);;
                    let seconds = ((song.item.duration % 60000) / 1000).toFixed(0);
                      return(
                        
                        <TouchableWithoutFeedback onPress={
                            ()=>{
                                this.playSong(song.item);
                            }
                        }>

                       
                        <View style={styles.songInfo}>
                     <View>
                     <Text style={{color:"#b3b3b3", overflow:"hidden"}} numberOfLines={1}>{song.item.title}</Text>
                     </View>
                      <View style={{flexDirection:"row", justifyContent:"space-between", marginTop:10}}>
                      <Text style={{color:"#737373", overflow:"hidden", width:"60%"}} numberOfLines={1}>{album}</Text>
                    <View style={{}}>                    
                    <Text style={{color:"#b3b3b3", fontSize:16 , }}>{minutes+":"+seconds}</Text>
                    </View>
                      </View>
                      </View>
                      </TouchableWithoutFeedback>
                      );
            }} />
        )
        }  
     }

    render() {
        let totalDuration = this.state.currentSong.duration;
        let minutes =  Math.floor(totalDuration / 60000);;
        let seconds = ((totalDuration % 60000) / 1000).toFixed(0);
        return (
           <View style={styles.main}>
             <View style={{height:"77%"}}>
             {this.loadSongs()}
             </View>
              <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}>
          <View style={{flex:1,margin:0}}>
            <View style={{height:"92%", backgroundColor:"#1C2427",alignItems:"center"}}>
            <View style={{width:"95%",height:"70%",marginTop:15,alignItems:"center"}}>
                <Image source={{uri:this.state.currentSong.artwork}} style={{width: "90%", height: "100%"}} resizeMode="contain" /> 
            </View>
                <View style={{flexDirection:"column",justifyContent:"space-between",padding:10, alignItems:"center", width:"95%", height:"15%",}}>
                 
                 <Text style={{color:"#b3b3b3", overflow:"hidden",fontSize:18, fontFamily:"baskerv", width:"80%", textAlign:"center"}} numberOfLines={1}>{this.state.currentSong.title}</Text>
                 
                    <Text style={{color:"#737373", overflow:"hidden", width:"60%",textAlign:"center"}}  numberOfLines={1}>{ (this.state.currentSong.album==null)?"No Album":this.state.currentSong.album  }</Text>
                    
                 
                </View>
            </View>
  
            <View style={{backgroundColor:"#18cda6", height:"8%", marginTop:0, justifyContent:"center", alignContent:"center"}}>
               <View style={{ flexDirection:"row", justifyContent:"space-around"}}>
              
              <TouchableWithoutFeedback onPress={
                  ()=>{
                    if(this.state.repeat){
                        this.setState({
                            repeat:!this.state.repeat,
                            repeatIconColor : "white"
                        });
                     } 
                     else{
                        this.setState({
                            repeat:!this.state.repeat,
                            repeatIconColor : "#ff9999"
                        });
                     }
                  }
              }>

              <View style={{ width:"15%", alignItems:"center"}}>
               <FontAwesome5 name="retweet" color={this.state.repeatIconColor} size={25} />
               </View>
               </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={
                  ()=>{
                    TrackPlayer.skipToPrevious();
                  }
              }>
                <View style={{ width:"15%", alignItems:"center"}}>
                <FontAwesome name="step-backward" color="white" size={25} />
                </View>
             
              </TouchableWithoutFeedback>
              
               
                <TouchableWithoutFeedback onPress={
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
                     <View style={{ width:"15%", alignItems:"center"}}>
                    <FontAwesome name={this.state.playingIcon} color="white" size={25}/>
                    </View>
                </TouchableWithoutFeedback>
               <TouchableWithoutFeedback onPress={
                   ()=>{
                    TrackPlayer.skipToNext();
                   }
               }>
                    <View style={{ width:"15%", alignItems:"center"}}>
               <FontAwesome name="step-forward" color="white" size={25}/>
               </View>
               </TouchableWithoutFeedback>
               <TouchableWithoutFeedback>
                     <View style={{ width:"15%", alignItems:"center"}}>
                <Feather name="shuffle" size={25} color="white"/>
                </View>
                </TouchableWithoutFeedback>
               </View>
                
             </View> 
          </View>
        </Modal>

            <TouchableWithoutFeedback onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
            <View style={{height:"16%",  flexDirection:"row", borderTopColor:"#737373", borderTopWidth:0.6}}>
                <View style={{width:"20%",height:"80%", marginLeft:"5%",marginTop:15}}>
                <Image source={{uri:this.state.currentSong.artwork}} style={{width: "100%", height: "100%"}} resizeMode="contain" /> 
                </View>
                <View style={{flexDirection:"column",justifyContent:"space-between",padding:10, marginLeft:"5%",marginTop:5, width:"75%"}}>
                    <Text style={{color:"#b3b3b3", overflow:"hidden",fontSize:18, fontFamily:"baskerv", width:"70%"}} numberOfLines={1}>{this.state.currentSong.title}</Text>
                    <Text style={{color:"#737373", overflow:"hidden", width:"60%"}}  numberOfLines={1}>{ (this.state.currentSong.album==null)?"No Album":this.state.currentSong.album  }</Text>
                <Text style={{color:"#737373", }}>{this.state.increasePlayDuration}/{minutes+":"+seconds}</Text>
                   
                </View>
                
             </View>


            </TouchableWithoutFeedback>
            
                
             <View style={{backgroundColor:"#18cda6", height:"8%", marginTop:0, justifyContent:"center", alignContent:"center"}}>
               <View style={{ flexDirection:"row", justifyContent:"space-around"}}>
              
              <TouchableWithoutFeedback  onPress={
                  ()=>{
                     if(this.state.repeat){
                        this.setState({
                            repeat:!this.state.repeat,
                            repeatIconColor : "white"
                        });
                     } 
                     else{
                        this.setState({
                            repeat:!this.state.repeat,
                            repeatIconColor : "#ff9999"
                        });
                     }
                  }
              }>

              <View style={{ width:"15%", alignItems:"center"}}>
               <FontAwesome5 name="retweet" color={this.state.repeatIconColor} size={25} />
               </View>
               </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={
                  ()=>{
                    TrackPlayer.skipToPrevious();
                  }
              }>
                <View style={{ width:"15%", alignItems:"center"}}>
                <FontAwesome name="step-backward" color="white" size={25} />
                </View>
             
              </TouchableWithoutFeedback>
              
               
                <TouchableWithoutFeedback onPress={
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
                     <View style={{ width:"15%", alignItems:"center"}}>
                    <FontAwesome name={this.state.playingIcon} color="white" size={25}/>
                    </View>
                </TouchableWithoutFeedback>
               <TouchableWithoutFeedback onPress={
                   ()=>{
                    TrackPlayer.skipToNext();
                   }
               }>
                    <View style={{ width:"15%", alignItems:"center"}}>
               <FontAwesome name="step-forward" color="white" size={25}/>
               </View>
               </TouchableWithoutFeedback>
               <TouchableWithoutFeedback>
                     <View style={{ width:"15%", alignItems:"center"}}>
                <Feather name="shuffle" size={25} color="white"/>
                </View>
                </TouchableWithoutFeedback>
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
        padding : 10,
        margin:10
        },

})
export default SongsListScreen;