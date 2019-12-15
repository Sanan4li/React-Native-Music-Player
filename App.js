import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
 Button,
 Image
} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import MusicFiles from 'react-native-get-music-files';
import {request, PERMISSIONS} from 'react-native-permissions';
import SongsListScreen from "./Screens/SongsListScreen";
class App extends React.Component{
  state = {
    storagePermission:null,
    songs : null,
  }

  // this track is already in my laptop where I am building the app... just to test play
//   track = {
//   id: 'testing123',
//   url: require('./maula.mp3'),
//   title: 'Maula Mere Maula',
//     artist: 'deadmau5',
//     album: 'while(1<2)',
//     genre: 'Progressive House, Electro House',
//     date: '2014-05-20T07:00:00+00:00', 
//  }

 // function to show music files on load button pressed.
 getSongs =() =>{
  let AllSongs;
  if(this.state.songs== null){
    return(
      <Text>Press Load Button to Load Songs.</Text>
    )
  }
  else{
    // here is the problem.... it does not show cover image 
    AllSongs = this.state.songs.map(
      (song)=>{
        return(
          <View key={song.title} style={{marginTop:5,borderRadius:2,borderColor:"black",borderWidth:2,padding:10}}>
          <Text>{song.title}</Text>
          <Text> {song.path} </Text>
        <Text>{song.album}</Text>
        <Text>{song.duration}</Text>
          <Image source={{uri:song.cover}} style={{width: 200, height: 200}}/> 
        </View>
        );
      }
    );
  }
 
    return AllSongs;
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
    // getting track player ready
  //   TrackPlayer.setupPlayer().then(() => {
  //     console.log("Player Setup Completed");
  //     TrackPlayer.add([this.track, ]).then(function() {
  //       console.log("Track Added");
  //   });
  // });
  }

  render(){
  return (
    <View style={styles.main}>
      {/* <Text>Music Player</Text>
      <View style={{flexDirection:"row", justifyContent:"space-between"}}>
      <Button title="Prev" onPress={
        ()=>{
          TrackPlayer.skipToPrevious();
        }
      } />
      <Button title="Load" onPress={
        ()=>{
        let Songs; 
        // loading all the music files presesnt in my phone
        MusicFiles.getAll({
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
               })
             }).catch(error => {
             console.log(error)
        });
        }
      } />
      <Button title="Pause"  onPress={
        ()=>{
          TrackPlayer.pause();
        }
      } />
      <Button title="Play" onPress={
        ()=>{
          TrackPlayer.play();
        }
      } />
      <Button title="Stop" onPress={
        ()=>{
          TrackPlayer.stop();
        }
      } />
       <Button title="Next" onPress={
        ()=>{
          TrackPlayer.skipToNext();
        }
      } />
      </View>
      <ScrollView>
      {this.getSongs()}
      </ScrollView> */}
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










