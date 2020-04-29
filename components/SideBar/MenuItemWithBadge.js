import React from 'react';
import {
    View,
    Text,
} from 'react-native';
import { Icon, Divider, Badge } from 'react-native-elements';

export default class MenuItemWithBadge extends React.Component {
    render(){
        const {name, type, color, content, textColor, exp, backgroundColor} = this.props
        return(
            <View style={{ height: 50, justifyContent: "space-between"}}>
                <View></View>
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row"}}>
                        <Icon
                            name={name}
                            type={type}
                            color={color}
                        />
                        <Text style={{color: textColor, fontSize: 18, marginLeft: 10}} >{content}</Text>
                    </View>
                        <Badge containerStyle={{ borderColor: "#f9b3b1", borderWidth: 1, backgroundColor: backgroundColor}} wrapperStyle={{width: 80}}>
                            <Text style={{color: "#ff5756"}}>{exp}</Text>
                        </Badge>
                </View>
                <Divider style={{ backgroundColor: '#e0e0e0', height: 1}} />
            </View>
        )
    }
}
