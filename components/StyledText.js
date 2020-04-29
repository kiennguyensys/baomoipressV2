import React from 'react';
import { Text } from 'react-native';
import { customFont } from '../constants/Fonts.js';

export class BaomoiText extends React.Component {
  render() {
    return <Text {...this.props} numberOfLines={3} style={[this.props.style, { fontFamily: customFont }]} />;
  }
}
