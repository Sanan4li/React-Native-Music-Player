import React, { Component } from 'react'
import {View, Text , StyleSheet, Dimensions, Image , TouchableWithoutFeedback , FlatList} from "react-native";
import TrackPlayer from 'react-native-track-player';
import MusicFiles from 'react-native-get-music-files';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";
import {request, PERMISSIONS} from 'react-native-permissions';
import * as Progress from 'react-native-progress';
 class SongsListScreen extends Component {
     state = {
         songs : null,
         songsAdded: [],
         storagePermission:null,
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
            // One of RATING_HEART, RATING_THUMBS_UP_DOWN, RATING_3_STARS, RATING_4_STARS, RATING_5_STARS, RATING_PERCENTAGE
           
            // Whether the player should stop running when the app is closed on Android
            stopWithApp: false,
        
            // An array of media controls capabilities
            // Can contain CAPABILITY_PLAY, CAPABILITY_PAUSE, CAPABILITY_STOP, CAPABILITY_SEEK_TO,
            // CAPABILITY_SKIP_TO_NEXT, CAPABILITY_SKIP_TO_PREVIOUS, CAPABILITY_SET_RATING
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
            ]
        
            
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
     componentDidMount = ()=>{
           // getting permission of storage
    request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(result => {
        this.setState({
          storagePermission : result
        }), ()=>{
          console.log(this.state.storagePermission);
        };
      });
       
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
           <View style={{alignItems:"center"}}>
                <Text style={{color:"white"}}>Loading Songs... Please Wait....</Text>
           </View>
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
        
        return (
           <View style={styles.main}>
             <View style={{height:"77%"}}>
             {this.loadSongs()}
             </View>
             <View style={{height:"13%",  flexDirection:"row", borderTopColor:"#737373", borderTopWidth:0.6}}>
                <View style={{width:"20%",height:"80%", marginLeft:"5%",marginTop:15}}>
                <Image source={{uri:this.state.currentSong.artwork}} style={{width: "100%", height: "100%"}} resizeMode="contain" /> 
                </View>
                <View style={{flexDirection:"column",justifyContent:"space-between",padding:10, marginLeft:"5%",marginTop:5, width:"75%"}}>
                    <Text style={{color:"#b3b3b3", overflow:"hidden",fontSize:18, fontFamily:"baskerv", width:"70%"}} numberOfLines={1}>{this.state.currentSong.title}</Text>
                    <Text style={{color:"#737373", overflow:"hidden", width:"60%"}}  numberOfLines={1}>{ (this.state.currentSong.album==null)?"No Album":this.state.currentSong.album  }</Text>
                    <Text style={{color:"#737373", }}>Duration</Text>
                   
                </View>
                
             </View>
             <View style={{height:"2%", marginTop:5,   justifyContent:"center",alignItems:"center"}}>
             <Progress.Bar progress={0.1} borderWidth={0.5} unfilledColor="white" color="#18cda6" borderColor="white" style={{width:"100%", backgroundColor:"ccc"}} width={0} />
             </View>
                
             <View style={{backgroundColor:"#18cda6", height:"8%", marginTop:0, justifyContent:"center", alignContent:"center"}}>
               <View style={{ flexDirection:"row", justifyContent:"space-around"}}>
              
              
               <FontAwesome5 name="retweet" color="white" size={25} />
              
              <TouchableWithoutFeedback onPress={
                  ()=>{
                    TrackPlayer.skipToPrevious();
                  }
              }>
              <FontAwesome name="step-backward" color="white" size={25} />
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
                    <FontAwesome name={this.state.playingIcon} color="white" size={25}/>
                </TouchableWithoutFeedback>
               <TouchableWithoutFeedback onPress={
                   ()=>{
                    TrackPlayer.skipToNext();
                   }
               }>
               <FontAwesome name="step-forward" color="white" size={25}/>
               </TouchableWithoutFeedback>
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
        padding : 10,
        margin:10
        },

})
export default SongsListScreen;