import React from "react";
import { StyleSheet, Text, View, Platform, Image, Dimensions } from "react-native";
import { BannerView, AdSettings } from 'react-native-fbads';
const { width } = Dimensions.get('window');
import { Viewport } from '@skele/components';

const loadingSource = require('../../../assets/images/large-banner-default.jpg')

const Placeholder = () =>
  <Image style={styles.imageLoading} source={loadingSource}/>

const VAFacebookBannerWithPlaceholder =
  Viewport.Aware(
    Viewport.WithPlaceholder(BannerView, Placeholder)
  )

export default class FacebookLargeBanner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ios: "415223319249971_446574836114819",
            android: "415223319249971_446095632829406",
            onRenderNull: true
        }
    }

    onLoad = () => {
        this.setState({ onRenderNull: false })
    }

    onError = (err) => {
        this.setState({onRenderNull: true})
        //console.log(err);
    }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    render() {
        const shouldHideSpaceAround = this.props.shouldHideSpaceAround
            return (
                  <View style={[styles.container, { height: (shouldHideSpaceAround) ? 90 : 110 , marginBottom: (shouldHideSpaceAround) ? 45 : 0 }]}>
                      {(this.props.isCurrentFocused && Platform.OS === 'ios' && !shouldHideSpaceAround) &&
                        <VAFacebookBannerWithPlaceholder
                          placementId={this.props.placementID}
                          type="large"
                          onLoad={this.onLoad}
                          onError={this.onError}
                        />
                      }

                      {(this.props.isCurrentFocused && (Platform.OS === 'android' || shouldHideSpaceAround)) &&
                        <BannerView
                          placementId={this.props.placementID}
                          type="large"
                          onLoad={this.onLoad}
                          onError={this.onError}
                        />
                      }

                      {(this.state.onRenderNull && !this.props.isCurrentFocused) &&
                          <Image style={styles.imageLoading} source={loadingSource}/>
                      }
                  </View>
            );
   }
}
const styles = StyleSheet.create({
  container: {
     flex: 1,
     height: 110,
     alignItems: "flex-start",
     justifyContent: "center",
  },
  imageLoading: {
      height: 90,
      width: width-20,
      marginHorizontal: 10,
      position: 'absolute',
      borderRadius: 5
  }
});
