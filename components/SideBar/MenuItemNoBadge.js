import React from 'react';
import {
    View,
    Text,
} from 'react-native';
import { Icon, Divider, Badge } from 'react-native-elements';

export default class MenuItemNoBadge extends React.Component {
    render(){
        const {name, type, color, content, textColor, hot} = this.props
        return(
            <View style={{ height: 50, justifyContent: "space-between"}}>
                <View></View>
                <View style={{flexDirection: "row"}}>
                    <Icon
                        name={name}
                        type={type}
                        color={color}
                    />
                <Text style={{color: textColor, fontSize: 18, marginLeft: 10}} >{content}</Text>
                {hot &&
                    <Badge containerStyle={{ backgroundColor: "#fd2624"}} wrapperStyle={{marginLeft: 10}}>
                        <Text style={{color: "white"}}>{hot.toString()}</Text>
                    </Badge>}
                </View>
                <Divider style={{ backgroundColor: '#e0e0e0', height: 1}} />
            </View>
        )
    }
}
