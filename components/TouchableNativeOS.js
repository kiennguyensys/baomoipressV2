import { Icon } from 'react-native-elements';
import { Platform, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';

export default class TouchableNativeOS extends PureComponent {
  render() {
    if(Platform.OS === 'android') {
      return (
          <View style={[this.props.style, { overflow: 'hidden' }]}>
            <TouchableNativeFeedback onPress={this.props.onPress}>
              <View style={[this.props.style, { overflow: 'hidden' }]}>
                {this.props.children}
              </View>
            </TouchableNativeFeedback>
          </View>
      )
      return
    } else if(Platform.OS === 'ios') {
      return (
        <TouchableOpacity style={this.props.style} onPress={this.props.onPress}>
          {this.props.children}
        </TouchableOpacity>
      )
      return
    } else {
      return (
        <TouchableOpacity style={this.props.style} onPress={this.props.onPress}>
          {this.props.children}
        </TouchableOpacity>
      )
    }
  }
}
