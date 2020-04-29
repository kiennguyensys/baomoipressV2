/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
    Platform,
    StatusBar,
    SafeAreaView,
} from 'react-native';

import AppNavigator from './components/navigation/AppNavigator';
import { Provider } from 'react-redux';
import { store } from './store/';
import { enableScreens } from 'react-native-screens';
enableScreens();

//import dateFormat from 'dateformat';
//import splashLogo from './assets/images/logo-splash.png';

if(__DEV__) {
    //import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))

    // const emitter = new EventEmitter()
    //
    // const events = Snoopy.stream(emitter)
    //
    // filter((info)=>info.method == 'createView', true)(events).subscribe()
    //
    // bars(info=>JSON.stringify(info.args).length)(
    //     filter({ method:'createView' })(events)
    // ).subscribe()

}

export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <SafeAreaView style={styles.safeArea}>
                    <StatusBar />
                    <AppNavigator />
                </SafeAreaView>
            </Provider>

        );
    }
}

const styles = {
    safeArea: {
        flex: 1
    }
}
