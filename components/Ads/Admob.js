import React, { Component } from 'react';
import AdmobBannerAd from './Admob/AdmobBannerAd';
import AdmobLargeBannerAd from './Admob/AdmobLargeBannerAd';
import AdmobRectangleBannerAd from './Admob/AdmobRectangleBannerAd';
import AdmobInterstitialAd from './Admob/AdmobInterstitialAd';
import AdmobRewardedAd from './Admob/AdmobRewardedAd';

export default class Admob extends React.PureComponent {

    render() {
        const { alternativeAdViewChoice, adID } = this.props.ads
        const shouldHideSpaceAround = this.props.shouldHideSpaceAround

        if(alternativeAdViewChoice === 'Banner'){
            const size = this.props.ads.alternativeBannerSize

            if(size === "largeBanner"){

                return <AdmobLargeBannerAd unitID={adID} shouldHideSpaceAround={shouldHideSpaceAround} />

            } else if(size === "banner") {

                return <AdmobBannerAd unitID={adID} shouldHideSpaceAround={shouldHideSpaceAround} />

            } else if(size === "rectangle") {

                return <AdmobRectangleBannerAd unitID={adID} shouldHideSpaceAround={shouldHideSpaceAround} />
            }
        }

        if(alternativeAdViewChoice === "Interstitial") {
            const minutesToSpawn = this.props.ads.minutesToSpawn

            return <AdmobInterstitialAd unitID={adID} minutesToSpawn={minutesToSpawn} />

        }

        if(alternativeAdViewChoice === "Rewarded") {

            return <AdmobRewardedAd unitID={adID} />

        }

    }

}
