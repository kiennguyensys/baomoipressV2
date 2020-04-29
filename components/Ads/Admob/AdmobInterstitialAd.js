import React from "react";
import { Button, StyleSheet, Text, View, Platform, AsyncStorage } from "react-native";
import { AdMobInterstitial } from "react-native-admob";
import { connect } from 'react-redux';
import { hideInterstitialAd, startAdvertisingTimer, stopAdvertisingTimer } from '../../../store/actions/timerActions.js';

import axios from 'axios';

class AdmobInterstitialAd extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            android: ["ca-app-pub-3940256099942544/1033173712", "ca-app-pub-3940256099942544/8691691433" ], //standard and video ads
            ios: ["ca-app-pub-3940256099942544/4411468910", "ca-app-pub-3940256099942544/5135589807" ],
            failed: false,
        }
    }

    componentDidUpdate(prevProps) {
        if((this.props.shouldShowInterstitialAd !== prevProps.shouldShowInterstitialAd) && this.props.shouldShowInterstitialAd) {
            this.prepareAd()
            setTimeout(() => this.props.hideInterstitialAd(), 3000)
        }
    }

    componentDidMount() {
        AdMobInterstitial.addEventListener("adFailedToLoad", err =>
            console.log(err)
        );

        if (!this.props.advertisingInterval) this.props.startAdvertisingTimer(this.props.minutesToSpawn)
    }

    prepareAd = () => {
        AdMobInterstitial.setAdUnitID(this.props.unitID);
        this.showInterstitial()
    }

    componentWillUnmount() {
        AdMobInterstitial.removeAllListeners();
        if (this.props.advertisingInterval) this.props.stopAdvertisingTimer(this.props.advertisingInterval)
    }

    bannerError() {
        console.log("An error");
        return;
    }

    showInterstitial = async() => {
        await AdMobInterstitial.requestAd()
        requestAnimationFrame(() => {
            AdMobInterstitial.showAd()
        });
    }

    render() {
        return null
      }
}

const mapStateToProps = (state) => {
    return {
        shouldShowInterstitialAd: state.timer.shouldShowInterstitialAd,
        advertisingInterval: state.timer.advertisingInterval,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        hideInterstitialAd: () => { dispatch(hideInterstitialAd()) },
        startAdvertisingTimer: (minutesToAdvertising) => { dispatch(startAdvertisingTimer(minutesToAdvertising)) },
        stopAdvertisingTimer: (interval) => { dispatch(stopAdvertisingTimer(interval)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdmobInterstitialAd)