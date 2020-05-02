import React, { Component } from 'react';
import axios from 'axios';
import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    SafeAreaView,
    Dimensions,
    Linking,
    Modal,
    Platform
} from 'react-native';
import { acf_url } from '../../../constants/API.js';
import { customFont } from '../../../constants/Fonts.js';
import FastImage from 'react-native-fast-image';
import Splash from '../../../assets/images/logo-splash.png';
import AppIcon from '../../../assets/images/app-icon.png';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const loadingSource = require('../../../assets/images/medium-banner-default.jpg')

export default class CustomFullScreenAd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.ads,
            timer: 5,
            modalVisible: true
        }
    }

    componentDidMount(){
        this.interval = setInterval(
            () => this.setState( prevState => ({ timer: prevState.timer - 1 })),
            1000
        );
    }

    openWebView = (link) => {
        this.props.navigation.navigate("WebView", { uri: link })
    }

    closeModal = () => {
        requestAnimationFrame(() => {
            this.props.navigation.navigate("HomeScreen")
        })
    }

    componentDidUpdate(){
        if(this.state.timer === 0){
            clearInterval(this.interval);
        }
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }


    render() {
        return(
            <Modal
               visible={this.state.modalVisible}
               onRequestClose={() => {}}
               >
                <SafeAreaView
                    style={{ flex: 1 }}
                >
                    <ImageBackground
                        source={Splash}
                        style={{flex: 1}}
                    >
                        <View style={styles.skipAdView}>
                            {(this.state.timer) ?
                             <Text style={styles.skipAdText}>{this.state.timer}</Text> :
                             <TouchableOpacity style={styles.skipButton} onPress={this.closeModal}>
                                <Text style={styles.skipAdText}>Bỏ qua</Text>
                             </TouchableOpacity>
                            }
                        </View>


                        <TouchableOpacity onPress={() => this.openWebView(this.state.data.adURL)} style={{ justifyContent: 'flex-start', alignItems: 'center', flex: 1}} activeOpacity={1}>
                            <FastImage
                                source={{uri: this.state.data.imageURL}}
                                style={[styles.image, {aspectRatio: parseFloat(this.state.data.aspectRatio)}]}
                            />

                            <View style={styles.logoSection}>
                                <FastImage
                                    source={AppIcon}
                                    style={{ width: 50 , height: 50, borderRadius: 5 }}
                                />
                            </View>

                        </TouchableOpacity>
                    </ImageBackground>
                </SafeAreaView>

            </Modal>

        )
    }

}

const styles = StyleSheet.create({
    image: {
        width: screenWidth
    },
    skipAdView: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
        width: 80,
        height: 40,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        right: 0,
        top: 10,
    },
    skipButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    skipAdText: {
        color: 'white',
        fontSize: 16
    },
    logoSection: {
        width: '100%',
        height: 60,
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0
    },
    logoText: {
        fontFamily: customFont,
        fontSize: 20,
        marginTop: 5,
        fontWeight: 'bold',
    },
    dotText: {
        marginTop: 15,
        height: 5,
        width: 5,
        borderRadius: 2.5,
        backgroundColor: 'red'
    }
})
