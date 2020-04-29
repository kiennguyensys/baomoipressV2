import React from "react";
import { StyleSheet, Text, View, Platform, Image } from "react-native";
import { AdMobBanner } from 'react-native-admob';
import { Viewport } from '@skele/components';
const loadingSource = require('../../../assets/images/medium-banner-default.jpg')

const Placeholder = () =>
  <Image style={styles.imageLoading} source={loadingSource} resizeMode='cover' />

const VAAdmobBannerWithPlaceholder =
  Viewport.Aware(
    Viewport.WithPlaceholder(AdMobBanner, Placeholder)
  )


export default class AdmobRectangleBannerAd extends React.Component {

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
                      adSize="mediumRectangle"
                      adUnitID={this.props.unitID}
                      onAdLoaded={this.adViewDidReceiveAd}
                      onAdFailedToLoad={this.bannerError}
                    />

                    {!this.state.isLoaded &&
                        <Image style={styles.imageLoading} source={loadingSource} resizeMode='cover' />
                    }
                </View> :
                <AdMobBanner
                  adSize="mediumRectangle"
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
     height: 270,
     alignItems: "center",
     justifyContent: "center",
  },
  imageLoading: {
      height: 250,
      width: 320,
      position: 'absolute',
      borderRadius: 5
  }
});
