import React from "react";
import { StyleSheet, Text, View, Platform, Image } from "react-native";
import axios from 'axios';
import { acf_url } from "../../constants/API.js";
import BannerNativeAd from "./FacebookAd/FacebookNativeBannerAd.js";
import MediaNativeAd from "./FacebookAd/FacebookNativeMediaAd.js";
import { NativeAdsManager, AdSettings } from 'react-native-fbads';

export default class NativeAd extends React.Component {
    state = {
            ios: '415223319249971_657925141646453',
            android: '415223319249971_446095919496044',
            isLoaded: false,
            adsManager: undefined
    }

    async componentDidMount(){
        const adsManager = await new NativeAdsManager(this.props.ads.adID, 2)
        this.setState({ adsManager: adsManager })
    }

    render() {
        const type = this.props.ads.fbNativeAdType

        if(type === 'media') {
            return (
                <View style={styles.mediaContainer}>
                    {(this.props.isCurrentFocused && this.state.adsManager) &&
                     <MediaNativeAd adsManager={this.state.adsManager} />
                    }
                </View>
            );
        }
        else if(type === 'banner') {
            return (
                <View style={styles.bannerContainer}>
                    {(this.props.isCurrentFocused && this.state.adsManager) &&
                     <BannerNativeAd adsManager={this.state.adsManager} />
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
