import React from 'react';
import {
  AdIconView,
  MediaView,
  AdChoicesView,
  TriggerableView,
  withNativeAd
} from 'react-native-fbads';
import { connect } from 'react-redux';
import {
  View,
  Text,
  Dimensions,
  Platform
} from 'react-native';
const { width } = Dimensions.get('window');

class FacebookNativeRectangleAd extends React.Component {
  render() {
    return (
      <View style={{ flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 5, justifyContent: 'space-between'}}>
            <Text style={{color: '#C0C0C0'}}>{this.props.nativeAd.sponsoredTranslation}</Text>
            <AdChoicesView style={{ position: 'absolute', right: (Platform.OS === 'ios') ? 80 : 0, top: 0 }}/>
        </View>
        <MediaView style={{ width: width - 20, height: 250 }} />
        <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>

          <AdIconView style={{ width: 50, height: 50, borderRadius: 25 }} />
          <View
            style={{ flexDirection: 'column', paddingHorizontal: 10, flex: 1 }}
          >
            <TriggerableView style={{ fontSize: 20, color: this.props.UI.textColor, fontWeight: 'bold' }} numberOfLines={2}>
              {this.props.nativeAd.headline}
            </TriggerableView>

          </View>
        </View>
        <View style={{ flexDirection: 'row', width: width - 20, alignItems: 'center', marginTop: 5, marginBottom: 10, justifyContent: 'space-between'}}>
            <TriggerableView style={{ flex: 3, fontSize: 14, lineHeight: 20, color: "#888F93"}} numberOfLines={3}>
              {this.props.nativeAd.bodyText}
            </TriggerableView>

            <TriggerableView
              style={{
                flex: 1,
                marginLeft: 10,
                fontSize: 14,
                color: '#fff',
                fontWeight: 'bold',
                backgroundColor: '#888F93',
                overflow: 'hidden',
                paddingVertical: 10,
                paddingHorizontal: 10,
                textAlign: 'center',
                justifyContent: 'center',
                marginTop: -10,
                borderRadius: 5,
              }}
            >
              {this.props.nativeAd.callToActionText}
            </TriggerableView>

        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        UI: state.UI,
    }
}

export default connect(mapStateToProps)(withNativeAd(FacebookNativeRectangleAd));