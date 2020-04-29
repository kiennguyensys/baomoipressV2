import React, { Component } from 'react';
import axios from 'axios';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    SafeAreaView,
    Dimensions,
    Linking,
} from 'react-native';
import { acf_url } from '../../../constants/API.js';
import FastImage from 'react-native-fast-image';

const screenWidth = Dimensions.get('window').width;
const loadingSource = require('../../../assets/images/medium-banner-default.jpg')

export default class CustomRectangleBannerAd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.ads,
        }
    }

    openWebView = (link) => {
        this.props.navigation.navigate("WebView", { uri: link })
    }


    render() {
        if(!this.state.data){
            return(
                <View style={styles.container}>
                    <Image style={styles.image} source={loadingSource} resizeMode='cover' />
                </View>
            )
        }else{
            return(
                <View style={[styles.container, { height: (this.props.shouldHideSpaceAround) ? 250 : 270 }]}>
                    <TouchableOpacity
                        onPress={() => this.openWebView(this.state.data.adURL)}
                    >
                        <FastImage
                            source={{uri: this.state.data.imageURL}}
                            style={styles.image}
                        />
                    </TouchableOpacity>
                </View>
            )
        }
    }

}

const styles = StyleSheet.create({
    container:{
        height: 270,
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: 320,
        height: 250,
        borderRadius: 5
    }
})
