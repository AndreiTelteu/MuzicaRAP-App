
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';

const theme = {
    ...DarkTheme,
    // roundness: 2,
    colors: {
        ...DarkTheme.colors,
        // primary: '#3498db',
        // accent: '#f1c40f',
    },
};

export default function Main() {
    return (
        <PaperProvider theme={theme}>
            <App />
        </PaperProvider>
    );
}

AppRegistry.registerComponent(appName, () => Main);
TrackPlayer.registerPlaybackService(() => require('./audioService.js'))
