import AdmobInterstitialAd from './Admob/AdmobInterstitialAd';
import FacebookInterstitial from './FacebookAd/FacebookInterstitial'

import React, { Component } from 'react';

export default class InterstitialAd extends React.PureComponent {
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
        const AdTypes = ["Admob", "Facebook"]
        // const AdTypes = ["Admob"]
        let choosenAdType = this.shuffle(AdTypes)
        if(choosenAdType[0] == "Admob") {
            return <AdmobInterstitialAd AdPosition={this.props.AdPosition}/>
        } else if (choosenAdType[0] == "Facebook") {
            return <FacebookInterstitial AdPosition={this.props.AdPosition}/>
        }
        else {
          return null
        }
    }

}
