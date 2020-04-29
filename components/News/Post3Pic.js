import React from 'react';
import {
    TouchableOpacity,
    View,
    Image,
    Dimensions,
    TouchableWithoutFeedback,
    InteractionManager
} from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { BaomoiText } from '../StyledText';
import moment from 'moment/min/moment-with-locales'
import FastImage from 'react-native-fast-image';
var { width, height } = Dimensions.get('window');
moment.locale('vi');
const defaultImg = 'https://homestaymatch.com/images/no-image-available.png'

const Comments = React.memo(props => {
    if(props.numberOfComments != 0){
        return(
                <View style={{flexDirection: "row", alignItems: "center"}}>
                <BaomoiText style={{color: '#C0C0C0', fontSize: 15}}> - {props.numberOfComments} </BaomoiText>
                <Icon containerStyle={{marginTop: -2}} name='comment' type="evilicon" color='#C0C0C0' size={20}/>
                </View>
        )
    }else{
        return null;
    }
})

class Post3Pic extends React.PureComponent {

    navigate = () => {
        requestAnimationFrame(() => {
            if(!this.props.shouldPushAnotherScreen){
                this.props.navigation.navigate("Article", {
                    Article: this.props.item
                })
            } else {
                this.props.navigation.push("Article", {
                    Article: this.props.item
                })
            }
        })
    }

    render(){
        const item = this.props.item
        const { textColor, backgroundColor } = this.props.UI
        const index = this.props.index
        return(
            <View style={{flex: 1, flexDirection: 'column', paddingHorizontal: 10, paddingVertical: 25, backgroundColor: backgroundColor}}>
                <TouchableWithoutFeedback style={{flex: 2}} onPress={this.navigate}>
                    <View style={{flexDirection: "row", marginBottom: 7}}>
                            <FastImage
                                source={{uri: item.content.images[0] || defaultImg}}
                                style= {{flex:1, height: 90, borderRadius: 5, backgroundColor: '#DCDCDC'}}
                            />
                            <FastImage
                                source={{uri: item.content.images[1] || defaultImg}}
                                style= {{flex:1, height: 90, marginLeft: 5, borderRadius: 5, backgroundColor: '#DCDCDC'}}
                            />
                            <FastImage
                                source={{uri: item.content.images[2] || defaultImg}}
                                style= {{flex:1, height: 90, marginLeft: 5, borderRadius: 5, backgroundColor: '#DCDCDC'}}
                            />
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback style={{flex: 1 }} onPress={this.navigate}>
                    <View>
                        <View style={{flexDirection: "row", alignItems:'center'}}>
                            {
                              (item.taxonomy_source[0])?
                                 <BaomoiText style={{color: '#C0C0C0', fontSize: 14}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                              :
                                  <BaomoiText style={{color: '#C0C0C0', fontSize: 14}}>{moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                            }
                            <Comments numberOfComments={item.total_comments.approved}/>
                        </View>
                        <BaomoiText style={{fontSize: 17 ,fontWeight: 'bold', color: textColor, lineHeight: 25}} numberOfLines={3}>{item.title.plaintitle}</BaomoiText>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        UI: state.UI
    }
}

export default connect(mapStateToProps)(Post3Pic)