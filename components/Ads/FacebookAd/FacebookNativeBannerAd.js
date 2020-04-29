import React from 'react';
import {
  AdIconView,
  AdChoicesView,
  TriggerableView,
  MediaView,
  withNativeAd
} from 'react-native-fbads';
import {
  View,
  Text,
  Dimensions,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
const { width } = Dimensions.get('window');

class FacebookNativeBannerAd extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TriggerableView styles={styles.AdIconView}>
            <AdIconView style={styles.AdIcon} />
        </TriggerableView>
        <MediaView style={{ width: 0, height: 0 }}/>
        <View style={styles.bodyView}>

            <TriggerableView style={styles.sponsoredText}>{this.props.nativeAd.sponsoredTranslation}</TriggerableView>
            <TriggerableView style={[styles.advertiserNameText, { color: this.props.UI.textColor }]} numberOfLines={2}>{this.props.nativeAd.advertiserName}</TriggerableView>
            <TriggerableView style={styles.headlineText} numberOfLines={2}>{this.props.nativeAd.headline}</TriggerableView>
        </View>

        <AdChoicesView style={{ position: 'absolute', right: (Platform.OS === 'android') ? 0 : 80, top: 0 }}/>

        <View style={styles.CTAView}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 2, justifyContent: 'center' }}>
            <TriggerableView
              style={styles.CTABtn}
            >
              {this.props.nativeAd.callToActionText}
            </TriggerableView>
          </View>
        </View>


      </View>
    );
  }
}

const styles = {
    container : {
        width: '100%',
        height: 100,
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    AdIconView: {
        flex: 1,
        padding: 10,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    AdIcon: {
        width: 80,
        height: 80,
        borderRadius: 5
    },
    bodyView: {
        height: 90,
        padding: 10,
        flex: 2,
        justifyContent: "space-between"
    },
    CTAView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sponsoredText: {
        color: '#588441',
        fontWeight: 'bold',
        fontSize: 12
    },
    advertiserNameText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    headlineText: {
        color: '#696969',
        fontSize: 14
    },
    CTABtn: {
        fontSize: 12,
        color: '#fff',
        textAlign: 'center',
        backgroundColor: '#588441',
        paddingVertical: 10,
        overflow: 'hidden',
        paddingHorizontal: 10,
        borderRadius: 5,
    }
}

const mapStateToProps = (state) => {
    return {
        UI: state.UI,
    }
}

export default connect(mapStateToProps)(withNativeAd(FacebookNativeBannerAd));