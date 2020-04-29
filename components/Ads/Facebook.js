import React, { Component } from 'react';
import {
    View,
    Platform
} from 'react-native';
import FacebookBanner from './FacebookAd/FacebookBanner'
import FacebookRectangle from './FacebookAd/FacebookRectangle'
import FacebookLargeBanner from './FacebookAd/FacebookLargeBanner'
import FacebookInterstitial from './FacebookAd/FacebookInterstitial'
import NativeAd from './NativeAd';
import { Viewport } from '@skele/components';

const nativeMediaPlaceholder = () =>
  <View style={styles.nativeMediaContainer}></View>

const nativeBannerPlaceholder = () =>
  <View style={styles.nativeBannerContainer}></View>

const VANativeBannerWithPlaceholder =
  Viewport.Aware(
    Viewport.WithPlaceholder(NativeAd, nativeBannerPlaceholder)
  )

const VANativeMediaWithPlaceholder =
  Viewport.Aware(
    Viewport.WithPlaceholder(NativeAd, nativeMediaPlaceholder)
  )


export default class Facebook extends React.PureComponent {

    render() {
        const { alternativeAdViewChoice, adID } = this.props.ads
        const isCurrentFocused = this.props.isCurrentFocused
        const shouldHideSpaceAround = this.props.shouldHideSpaceAround

        if(alternativeAdViewChoice === 'Banner'){
            const size = this.props.ads.alternativeBannerSize

            if(size === "largeBanner"){

                return <FacebookLargeBanner placementID={adID} isCurrentFocused={isCurrentFocused} shouldHideSpaceAround={shouldHideSpaceAround} />

            } else if (size === "banner") {

                return <FacebookBanner placementID={adID} isCurrentFocused={isCurrentFocused} shouldHideSpaceAround={shouldHideSpaceAround} />

            } else if (size === "rectangle") {

                return <FacebookRectangle placementID={adID} isCurrentFocused={isCurrentFocused} shouldHideSpaceAround={shouldHideSpaceAround} />
            }

        }

        if (alternativeAdViewChoice === "Interstitial") {
            const minutesToSpawn = this.props.ads.minutesToSpawn

            return <FacebookInterstitial placementID={adID} minutesToSpawn={minutesToSpawn} />

        }

        if(alternativeAdViewChoice === "Rewarded") {

            return <View />

        }

        if(alternativeAdViewChoice === "Native(Facebook)") {
            const type = this.props.ads.fbNativeAdType

            if(Platform.OS === 'android' || shouldHideSpaceAround) {
                return <NativeAd ads={this.props.ads} isCurrentFocused={isCurrentFocused} />
            }

            if(type === 'media') {
                return <VANativeMediaWithPlaceholder ads={this.props.ads} isCurrentFocused={isCurrentFocused} />
            }

            if(type === 'banner') {
                return <VANativeBannerWithPlaceholder ads={this.props.ads} isCurrentFocused={isCurrentFocused} />
            }

            return <View />
        }

    }

}

const styles = {
  nativeMediaContainer: {
     marginVertical: 10,
     height: 400,
     alignItems: "center",
     justifyContent: "center",
  },
  nativeBannerContainer: {
     height: 100,
     alignItems: "center",
     justifyContent: "center",
  },
};
