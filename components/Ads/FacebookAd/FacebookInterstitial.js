import React from "react";
import { Button, StyleSheet, Text, View, Platform, AsyncStorage } from "react-native";
import { InterstitialAdManager, AdSettings } from 'react-native-fbads';
import { connect } from 'react-redux';
import { hideInterstitialAd, startAdvertisingTimer, stopAdvertisingTimer } from '../../../store/actions/timerActions.js';

class FacebookInterstitial extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            android: "415223319249971_445354909570145",
            ios: "415223319249971_446574599448176",
            failed: false,
        }
    }

    componentWillUnmount() {
        if (this.props.advertisingInterval) this.props.stopAdvertisingTimer(this.props.advertisingInterval)
    }

    componentDidMount() {
        if (!this.props.advertisingInterval) this.props.startAdvertisingTimer(this.props.minutesToSpawn)
    }

    componentDidUpdate(prevProps) {
        if((this.props.shouldShowInterstitialAd !== prevProps.shouldShowInterstitialAd) && this.props.shouldShowInterstitialAd) {
            this.showAD()
            setTimeout(() => this.props.hideInterstitialAd(), 3000)
        }
    }

    showAD = () => {
        this.showInterstitial(this.props.placementID);
    }

    showInterstitial = async(placementId) => {
        InterstitialAdManager.showAd(placementId)
            .then(didClick => {})
            .catch(error => {});
    }

    render() {
        return null
    }
}

const mapStateToProps = (state) => {
    return {
        shouldShowInterstitialAd: state.timer.shouldShowInterstitialAd,
        advertisingInterval: state.timer.advertisingInterval
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        hideInterstitialAd: () => { dispatch(hideInterstitialAd()) },
        startAdvertisingTimer: (minutesToAdvertising) => { dispatch(startAdvertisingTimer(minutesToAdvertising)) },
        stopAdvertisingTimer: (interval) => { dispatch(stopAdvertisingTimer(interval)) }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FacebookInterstitial)

