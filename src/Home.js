import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Animated,
} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import NchanSubscriber from 'react-native-nchan';
import Svg, { Path } from 'react-native-svg';

class Home extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            playing: false,
            track: {
                id: 'radio',
                url: 'https://stream.muzicarap.ro/radio/8000/radio.mp3',
                title: 'MuzicaRAP',
                artist: '',
                album: '',
                genre: 'HipHop',
                artwork: 'https://stream.muzicarap.ro/static/img/generic_song.jpg',
            },
            updated: null,
        }
        this.wsMessage = this.wsMessage.bind(this)
        this.playPause = this.playPause.bind(this)
    }
    
    componentDidMount() {
        TrackPlayer.setupPlayer({
            minBuffer: 1,
            playBuffer: 0,
            backBuffer: 0,
            maxBuffer: 1,
            maxCacheSize: 500,
        }).then(() => {
            
            TrackPlayer.add(this.state.track).then(() => {
                this.setState({playing: true})
                TrackPlayer.play()
                TrackPlayer.updateOptions({
                    stopWithApp: false,
                    capabilities: [
                        TrackPlayer.CAPABILITY_PLAY,
                        TrackPlayer.CAPABILITY_PAUSE,
                        TrackPlayer.CAPABILITY_STOP,
                    ],
                    compactCapabilities: [
                        TrackPlayer.CAPABILITY_PLAY,
                        TrackPlayer.CAPABILITY_STOP,
                    ],
                    // Icons for the notification on Android (if you don't like the default ones)
                    // playIcon: require('./play-icon.png'),
                    // pauseIcon: require('./pause-icon.png'),
                    // stopIcon: require('./stop-icon.png'),
                    // previousIcon: require('./previous-icon.png'),
                    // nextIcon: require('./next-icon.png'),
                    // icon: require('./notification-icon.png'), // The notification icon
                });
            });
        })
        
        const sub = new NchanSubscriber('https://stream.muzicarap.ro/api/live/nowplaying/MuzicaRAP', { subscriber: 'websocket' })
        sub.on('message', this.wsMessage)
        sub.start()
    }
    
    wsMessage(message, message_metadata) {
        let data = JSON.parse(message);
        if (!data || !data.now_playing) return;
        
        this.state.track.title = data.now_playing.song.title
        this.state.track.artist = data.now_playing.song.artist
        this.state.track.album = data.now_playing.song.album
        let newArtwork = this.imagecdn(data.now_playing.song.art)
        if (this.state.track.artwork != newArtwork) {
            this.state.track.artwork = newArtwork
        }
        this.setState({ updated: Date.now() })
        
        TrackPlayer.updateMetadataForTrack(this.state.track.id, {
            title: this.state.track.title,
            artist: this.state.track.artist,
            album: this.state.track.album,
            artwork: this.state.track.artwork,
        })
        
    }
    
    imagecdn(url) {
        if (!url) url = 'https://stream.muzicarap.ro/static/img/generic_song.jpg';
        url = url.replace('https://' , '').replace('http://' , '');
        return 'https://cdn.statically.io/img/' + url + '?w=400&quality=100';
    }
    
    playButtonPathRef = null
    playPause() {
        let iconPause = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26";
        let iconPlay  = "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28";
        if (this.state.playing) {
            TrackPlayer.pause()
            this.state.playing = false
            this.playButtonPathRef.setNativeProps({ d: iconPlay })
        } else {
            TrackPlayer.seekTo(0)
            TrackPlayer.play()
            this.state.playing = true
            this.playButtonPathRef.setNativeProps({ d: iconPause })
        }
    }
    
    render() {
        return (
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContainer}
            >
                <ImageBackground
                    source={{uri: this.state.track.artwork}}
                    style={styles.backgroundImageContainer}
                    imageStyle={styles.backgroundImage}
                    blurRadius={0.6}
                    opacity={0.7}
                >
                    <View style={styles.trackInfo}>
                        <Text>{this.state.track.title}</Text>
                        <Text>{this.state.track.artist}</Text>
                        <Text>{this.state.track.album}</Text>
                    </View>
                    <View style={styles.controls}>
                        <TouchableOpacity onPress={() => this.playPause()} style={{width: 100, height: 100}}>
                            <Svg width="100%" height="100%" viewBox="0 0 36 36" >
                                <Path ref={(ref) => this.playButtonPathRef = ref} d="M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26" />
                            </Svg>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </ScrollView>
        )
    }
    
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#303030',
    },
    scrollViewContainer: {
        flexGrow: 1,
        alignContent: 'center',
        justifyContent: 'center',
    },
    backgroundImageContainer: {
        alignContent: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
    },
    backgroundImage: {
    },
    trackInfo: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    controls: {
        alignItems: 'center',
    },
});

export default Home;
