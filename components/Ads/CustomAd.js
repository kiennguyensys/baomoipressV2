import React, { Component } from 'react';
import CustomBannerAd from './Custom/CustomBannerAd';
import CustomLargeBannerAd from './Custom/CustomLargeBannerAd';
import CustomRectangleBannerAd from './Custom/CustomRectangleBannerAd';
import CustomFullScreenAd from './Custom/CustomFullScreenAd';
import Article1PicAd from './Custom/Article1PicAd'
import Article3PicsAd from './Custom/Article3PicsAd'
import Article1ThumbAd from './Custom/Article1ThumbAd'

export default class CustomAd extends React.PureComponent {

    render() {
        const { customAdViewChoice } = this.props.ads
        const shouldHideSpaceAround = this.props.shouldHideSpaceAround

        if(customAdViewChoice === 'Banner'){
            const bannerSize = this.props.ads.customBannerSize

            if(bannerSize === "largeBanner"){

                return <CustomLargeBannerAd ads={this.props.ads} navigation={this.props.navigation} shouldHideSpaceAround={shouldHideSpaceAround} />

            } else if (bannerSize === "banner") {

                return <CustomBannerAd ads={this.props.ads} navigation={this.props.navigation} shouldHideSpaceAround={shouldHideSpaceAround} />

            } else if (bannerSize === "rectangle") {

                return <CustomRectangleBannerAd ads={this.props.ads} navigation={this.props.navigation} shouldHideSpaceAround={shouldHideSpaceAround} />

            } else if (bannerSize === "fullScreen") {

                return <CustomFullScreenAd ads={this.props.ads} navigation={this.props.navigation} />

            }
        }

        if(customAdViewChoice === 'Article') {
            const type = this.props.ads.articleAdType

            if(type === "1 image"){

                return <Article1PicAd ads={this.props.ads} navigation={this.props.navigation} />

            } else if (type === "3 images") {

                return <Article3PicsAd ads={this.props.ads} navigation={this.props.navigation} />

            } else if (type === "1 thumb") {

                return <Article1ThumbAd ads={this.props.ads} navigation={this.props.navigation} />

            }
        }
    }

}
