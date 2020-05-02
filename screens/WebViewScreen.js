import React, {Component} from 'react';
import {
    ProgressBarAndroid,
    ProgressViewIOS,
    Platform
} from 'react-native';
import WebView from 'react-native-webview';
import BackIcon from '../components/BackIcon';
import {
    View,
    SafeAreaView,
    Linking
} from 'react-native';

export default class WebViewScreen extends Component {
    state = { loadingProgress: 0 }
    static navigationOptions = ({navigation}) => {
        return {
            tabBarVisible: false,
            header: () => (
                    <SafeAreaView
                        style={{
                        height: 50,
                        flexDirection: "row",
                        backgroundColor: "white",
                        alignItems:'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#e0e0e0'
                        }}
                    >
                        <BackIcon style={{flex: 1, width: 50, height:50, alignItems: 'center', justifyContent: 'center'}}
                                  onPress={() => {
                                            navigation.goBack()
                                        }}
                        />
                        <View style={{flex: 5}}></View>
                    </SafeAreaView>
            )
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {this.state.loadingProgress !== 1 &&
                    <View>
                    {Platform.OS == 'ios' &&
                        <ProgressViewIOS progress={this.state.loadingProgress}/>
                    }
                    {Platform.OS == 'android' &&
                        <ProgressBarAndroid progress={this.state.loadingProgress} styleAttr="Horizontal" indeterminate={false} />
                    }
                    </View>
                }
                <WebView
                    useWebKit={true}
                    source={{uri: this.props.navigation.getParam("uri")}}
                    style={{flex: 1, overflow: 'hidden', opacity: 0.99 }}
                    onLoadProgress={({ nativeEvent }) => {
                        this.setState({ loadingProgress: nativeEvent.progress })
                    }}
                />
            </View>
        );
    }
}