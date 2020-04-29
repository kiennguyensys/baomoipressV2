import React from "react";
import { StyleSheet, Text, View, Platform, Image, Dimensions } from "react-native";
const loadingSource = require('../../../assets/images/medium-banner-default.jpg')
import { BannerView, AdSettings } from 'react-native-fbads';
import { Viewport } from '@skele/components';

const { width } = Dimensions.get("window")

const Placeholder = () =>
  <Image style={styles.imageLoading} source={loadingSource}/>

const VAFacebookBannerWithPlaceholder =
  Viewport.Aware(
    Viewport.WithPlaceholder(BannerView, Placeholder)
  )



export default class FacebookRectangle extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ios: "415223319249971_446575002781469",
            android: "415223319249971_443829819722654",
            onRenderNull: true
        }
    }

    onLoad = () => {
        this.setState({ onRenderNull: false })
    }

    onError = (err) => {
        this.setState({onRenderNull: true})
        console.log(err);
    }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    render() {
        const shouldHideSpaceAround = this.props.shouldHideSpaceAround
            return (
                  <View style={[styles.container, { height: (shouldHideSpaceAround) ? 250 : 270 , marginBottom: (shouldHideSpaceAround) ? 0 : 0 }]}>
                      {(this.props.isCurrentFocused && Platform.OS === 'ios' && !shouldHideSpaceAround) &&
                        <VAFacebookBannerWithPlaceholder
                          placementId={this.props.placementID}
                          type="rectangle"
                          onLoad={this.onLoad}
                          onError={this.onError}
                        />
                      }

                      {(this.props.isCurrentFocused && (Platform.OS === 'android' || shouldHideSpaceAround )) &&
                        <BannerView
                          placementId={this.props.placementID}
                          type="rectangle"
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
     height: 270,
     justifyContent: "center",
  },
  imageLoading: {
      height: 250,
      width: width-20,
      marginHorizontal: 10,
      alignItems: 'center',
      position: 'absolute',
      borderRadius: 5
 }
});
