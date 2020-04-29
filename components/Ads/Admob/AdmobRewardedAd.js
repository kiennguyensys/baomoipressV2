import React from "react";
import { Button, StyleSheet, Text, View, Platform, AsyncStorage } from "react-native";
import { AdMobRewarded } from "react-native-admob";

import axios from 'axios';

export default class AdmobRewardedAd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            android: "ca-app-pub-3940256099942544/5224354917",
            ios: "ca-app-pub-3940256099942544/1712485313",
            failed: false,
        }
        this.prepareAd()
    }

    componentDidUpdate(prevProps) {
        if((this.props.shouldShowRewardedAd !== prevProps.shouldShowRewardedAd) && this.props.shouldShowRewardedAd) {
            this.showRewarded()
        }
    }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    componentDidMount() {
        AdMobRewarded.addEventListener("adFailedToLoad", err =>
            console.log(err)
        );

        AdMobRewarded.addEventListener("rewarded", this.props.rewardedCallback);
    }

    prepareAd = () => {
        AdMobRewarded.setAdUnitID(this.props.unitID);
        AdMobRewarded.requestAd()
    }

    componentWillUnmount() {
        AdMobRewarded.removeAllListeners();
    }

    showRewarded = async() => {
        requestAnimationFrame(() => {
            AdMobRewarded.showAd()
        })
    }

    render() {
        return null
      }
}
