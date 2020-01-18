
import TrackPlayer from 'react-native-track-player';

module.exports = async function() {
    
    // This service needs to be registered for the module to work
    // but it will be used later in the "Receiving Events" section
    
    TrackPlayer.addEventListener('remote-play',  () => {
        TrackPlayer.seekTo(0)
        TrackPlayer.play()
    })
    
    TrackPlayer.addEventListener('remote-pause', () => {
        TrackPlayer.pause()
    })
    
    TrackPlayer.addEventListener('remote-stop',  () => {
        TrackPlayer.destroy()
    })
    
}
