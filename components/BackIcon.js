import { Icon } from 'react-native-elements';
import { Platform, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';

export default class BackIcon extends PureComponent {
  render() {
    if(Platform.OS === 'android') {
      return (
          <View style={this.props.style}>
            <TouchableNativeFeedback useForeGround={TouchableNativeFeedback.canUseNativeForeground()} onPress={this.props.onPress} style={this.props.style}>
              <View style={this.props.style}>
                <Icon size={25} color="#696969" name='arrow-left' type='material-community' />
              </View>
            </TouchableNativeFeedback>
          </View>
      )
      return
    } else if(Platform.OS === 'ios') {
      return (
        <TouchableOpacity {...this.props}>
          <Icon size={25} color="#696969" name='chevron-thin-left' type='entypo' />
        </TouchableOpacity>
      )
      return
    } else {
      return (
        <TouchableOpacity {...this.props}>
          <Icon size={25} color="#696969" name='chevron-thin-left' type='entypo' />
        </TouchableOpacity>
      )
    }
  }
}
