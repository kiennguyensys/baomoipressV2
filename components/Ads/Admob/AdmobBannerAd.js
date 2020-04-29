import React from "react";
import { StyleSheet, Text, View, Platform, Image } from "react-native";
import {
  AdMobBanner
} from 'react-native-admob';

const loadingSource = require('../../../assets/images/banner-default.jpg')
import { Viewport } from '@skele/components';

const Placeholder = () =>
  <Image style={styles.imageLoading} source={loadingSource} resizeMode='cover' />

const VAAdmobBannerWithPlaceholder =
  Viewport.Aware(
    Viewport.WithPlaceholder(AdMobBanner, Placeholder)
  )


export default class AdmobBannerAd extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ios: "ca-app-pub-3940256099942544/2934735716",
            android: "ca-app-pub-3940256099942544/6300978111",
            isLoaded: false
        }
    }

    adViewDidReceiveAd = () => this.setState({isLoaded: true})

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    bannerError = (err) => {
        console.log(err);
        return;
    }

    render() {
        return (
            <View style={{ alignItems: 'center' }}>
                {!this.props.shouldHideSpaceAround ?
                <View style={styles.container}>
                    <AdMobBanner
                      adSize="banner"
                      adUnitID={this.props.unitID}
                      onAdLoaded={this.adViewDidReceiveAd}
                      onAdFailedToLoad={this.bannerError}
                    />

                    {!this.state.isLoaded &&
                        <Image style={styles.imageLoading} source={loadingSource} resizeMode='cover' />
                    }
                </View> :
                <AdMobBanner
                  adSize="banner"
                  adUnitID={this.props.unitID}
                  onAdLoaded={this.adViewDidReceiveAd}
                  onAdFailedToLoad={this.bannerError}
                />
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
  container: {
     height: 70,
     alignItems: "center",
     justifyContent: "center",
  },
  imageLoading: {
      height: 50,
      width: 320,
      position: 'absolute',
      borderRadius: 5
  }
});
