import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
} from 'react-native';
import Home from './src/Home'

console.disableYellowBox = true;

const App: () => React$Node = () => {
    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{flex: 1, position: 'relative'}}>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollViewContainer}
                >
                    <Home />
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    scrollView: {
    },
    scrollViewContainer: {
        flex: 1,
    },
});

export default App;
