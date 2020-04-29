import React from 'react';
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Image,
    Dimensions,
    Text
} from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import { connect } from 'react-redux'
import Ads from '../Ads/Ads.js';
var { width, height } = Dimensions.get('window');


class HotEvent extends React.PureComponent {
    render(){
        const { textColor, backgroundColor } = this.props.UI

        return(
            <View style={{backgroundColor: backgroundColor }}>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10}}>
                    <Text style={{fontSize: 15, fontWeight: "bold", color: textColor}}>SỰ KIỆN NÓNG</Text>
                    <Icon
                        name='share-google'
                        type='evilicon'

                    />
                </View>
                <Divider style={{ backgroundColor: '#e0e0e0'}}/>
                <Ads adPosition="Sự kiện nóng" navigation={this.props.navigation} isCurrentFocused={this.props.isCurrentFocused} shouldHideDivider />
                <View style={{backgroundColor: "#e0e0e0", height: 10, width: width}}></View>
            </View>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        UI: state.UI
    }
}

export default connect(mapStateToProps)(HotEvent)