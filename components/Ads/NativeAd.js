import React from "react";
import { StyleSheet, Text, View, Platform, Image, AsyncStorage } from "react-native";
import axios from 'axios';
import { acf_url } from "../../constants/API.js";
import BannerNativeAd from "./FacebookAd/FacebookNativeBannerAd.js";
import MediaNativeAd from "./FacebookAd/FacebookNativeMediaAd.js";
import { NativeAdsManager, AdSettings } from 'react-native-fbads';
const adsManager = new NativeAdsManager('658766681193257_942159016187354', 2)

export default class NativeAd extends React.Component {
    state = {
            ios: '415223319249971_657925141646453',
            android: '415223319249971_446095919496044',
            isLoaded: false,
            adsManager: undefined
    }

    async componentDidMount(){

        //this.setState({ adsManager: adsManager })
    }

    render() {
        const type = this.props.ads.fbNativeAdType

        if(type === 'media') {
            return (
                <View style={styles.mediaContainer}>
                    {(this.props.isCurrentFocused) &&
                     <MediaNativeAd adsManager={adsManager} />
                    }
                </View>
            );
        }
        else if(type === 'banner') {
            return (
                <View style={styles.bannerContainer}>
                    {(this.props.isCurrentFocused) &&
                     <BannerNativeAd adsManager={adsManager} />
                    }
                </View>
            );
        }
    }
}
const styles = StyleSheet.create({
  mediaContainer: {
     marginVertical: (Platform.OS === 'ios') ? 20 : 10,
     height: 400,
     alignItems: "center",
     justifyContent: "center",
  },
  bannerContainer: {
     height: 100,
     alignItems: "center",
     justifyContent: "center",
  },
});
