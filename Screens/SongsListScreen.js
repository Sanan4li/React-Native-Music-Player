import React, { Component } from 'react'
import {View, Text , StyleSheet, Dimensions, Image , TouchableWithoutFeedback , FlatList} from "react-native";
import TrackPlayer from 'react-native-track-player';
import MusicFiles from 'react-native-get-music-files';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";
import {request, PERMISSIONS} from 'react-native-permissions';
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
     
     playNextSong = (currentSong)=>{
      let index = this.state.songs.findIndex(
          (i)=>{
            return i == currentSong
          }
      );
      this.setState({
          currentSong: this.state.songs[index+1]
      });
     }
     playPreviousSong = (currentSong)=>{
        let index = this.state.songs.findIndex(
            (i)=>{
              return i == currentSong
            }
        );
        this.setState({
            currentSong: this.state.songs[index-1]
        });
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
             <View style={{height:"2%", marginTop:5,  justifyContent:"center",alignItems:"center"}}>
           
             </View>
                
             <View style={{backgroundColor:"#18cda6", height:"8%", marginTop:0, justifyContent:"center", alignContent:"center"}}>
               <View style={{ flexDirection:"row", justifyContent:"space-around"}}>
              
              
               <FontAwesome5 name="retweet" color="white" size={25} />
              
              <TouchableWithoutFeedback onPress={
                  ()=>{
                    TrackPlayer.skipToPrevious();
                   this.playPreviousSong(this.state.currentSong);
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
                    this.playNextSong(this.state.currentSong);
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