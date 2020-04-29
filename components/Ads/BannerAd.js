import React, { Component } from 'react';
import AdmobBannerAd from './Admob/AdmobBannerAd';
import AdmobLargeBannerAd from './Admob/AdmobLargeBannerAd';
import AdmobRectangleBannerAd from './Admob/AdmobRectangleBannerAd';
import FacebookBanner from './FacebookAd/FacebookBanner'
import FacebookRectangle from './FacebookAd/FacebookRectangle'
import FacebookLargeBanner from './FacebookAd/FacebookLargeBanner'
import NativeAd from './NativeAd';
import CustomBannerAd from './Custom/CustomBannerAd';
import CustomLargeBannerAd from './Custom/CustomLargeBannerAd';
import CustomRectangleBannerAd from './Custom/CustomRectangleBannerAd';
export default class BannerAd extends React.PureComponent {

    shuffle = (array) => {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
        }

        return array;
    }

    render() {
        const AdTypes = ["Admob", "Custom", "Facebook"]
        // const AdTypes = ["Admob"]
        let choosenAdType = this.shuffle(AdTypes)

        if(this.props.size == "native") {
            return <NativeAd />
        }
        if(this.props.size === "large"){
            if(choosenAdType[0] == "Admob"){
                //console.log('Large Admob')
                return <AdmobLargeBannerAd adPosition={this.props.adPosition}/>
            }else if (choosenAdType[0] == "Custom") {
                //console.log('Large Custom')
                return <CustomLargeBannerAd adPosition={this.props.adPosition}/>
            }
            else if (choosenAdType[0] == "Facebook") {
                return <FacebookLargeBanner adPosition={this.props.adPosition}/>
            }
            else {
              return null
            }
        }else if (this.props.size === "small") {
            if(choosenAdType[0] == "Admob"){
                //console.log('small Admob')
                return <AdmobBannerAd adPosition={this.props.adPosition}/>
            }else if (choosenAdType[0] == "Custom") {
                //console.log('small Custom')
                return <CustomBannerAd adPosition={this.props.adPosition}/>
            }
            else if (choosenAdType[0] == "Facebook") {
                return <FacebookBanner adPosition={this.props.adPosition}/>
            }
            else {
              return null
            }
        }else if (this.props.size === "rectangle") {
            if(choosenAdType[0] == "Admob"){
                //console.log('rectangle Admob')
                return <AdmobRectangleBannerAd adPosition={this.props.adPosition}/>
            }else if (choosenAdType[0] == "Custom") {
                //console.log('rectangle Custom')
                return <CustomRectangleBannerAd adPosition={this.props.adPosition}/>
            }
            else if (choosenAdType[0] == "Facebook") {
                return <FacebookRectangle adPosition={this.props.adPosition}/>
            }
            else {
              return null
            }
        }
    }

}
