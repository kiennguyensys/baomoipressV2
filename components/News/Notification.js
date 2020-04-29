import React from 'react';
import {
    TouchableOpacity,
    View,
    Image,
    Dimensions,
    Text
} from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { BaomoiText } from '../StyledText';
import dateFormat from 'dateformat';
var { width, height } = Dimensions.get('window');

class Notification extends React.PureComponent {

    render(){
        const item = this.props.item
        const index = this.props.index
        const { textColor, backgroundColor, textSizeRatio } = this.props.UI
        const title = this.props.item.title.rendered
        const excerpt = this.props.item.excerpt.rendered
        const {id} = this.props.item
        const date = this.props.item.modified
        return(


            <View style={{padding: 10}}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => this.props.navigation.navigate("NotificationsDetail", {
                        data: item,
                    })}
                    style={{backgroundColor: backgroundColor}}
                >
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <View>
                            <View>
                                <Text style={{fontWeight: "bold", fontSize: 20, color: textColor}}>{title}</Text>
                            </View>
                            <View>
                                <Text style={{color: textColor}}>{dateFormat(date, "dd-mm-yyyy")}</Text>
                            </View>
                        </View>
                        <View>
                            <Icon
                                name='angle-right'
                                type='font-awesome'
                                color='#696969'
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        UI: state.UI
    }
}

export default connect(mapStateToProps)(Notification)
